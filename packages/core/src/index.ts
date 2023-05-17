import { cloneDeep, merge, set } from 'lodash-es';
import {
  FieldEntity,
  GroupEntity,
  NamePath,
  InternalNamePath,
  NameCollection,
  Store,
  ValueChangeParams,
} from './type';
import { getNamePathByNameCollection } from './utils/namePathUtils';
import { getValue, setValue } from './utils/valueUtils';
import Observer from './plugins/observer';
import { getNamePath } from './utils/typeUtils';

class Form<T extends Store = Store> {
  #store: T = {} as T;
  #initialValues: T = {} as T;
  #fieldEntities: FieldEntity[] = [];
  #groupMap: Map<string, GroupEntity> = new Map();
  #valueObserver = new Observer<ValueChangeParams<T>>();
  #preserve?: boolean;

  // ============== init or register =======================

  private setInitialValues = (values: T, init?: boolean) => {
    this.#initialValues = values;
    if (init) {
      this.updateStore(cloneDeep(values));
    }
  };

  private registerField = (entity: FieldEntity) => {
    this.#fieldEntities.push(entity);
    if (entity.props?.initialValue && entity.props?.name) {
      this.setFieldValue(entity.props.name, entity.props.initialValue);
    }
    return () => {
      this.#fieldEntities = this.#fieldEntities.filter((item) => item !== entity);
      if (!this.isMergedPreserve(entity.isPreserve())) {
        const namePath = entity.getNamePath();
        const defaultValue = this.getInitialValue(namePath);
        const prevStore = this.#store;
        this.setFieldValue(namePath, undefined);
        this.updateStore(set(prevStore, namePath, defaultValue));
        this.#valueObserver.dispatch({
          prevStore,
          info: { type: 'remove' },
          namePathList: [entity.getNamePath()],
        });
      }
    };
  };

  private registerGroup = (group: GroupEntity) => {
    const groupPath = `${group.props.name}`;
    this.#groupMap.set(groupPath, group);
    return () => {
      this.#groupMap.delete(groupPath);
    };
  };

  // =================== get or set ===================

  private getInitialValue = (namePath: InternalNamePath) => {
    const initValue = getValue(this.#initialValues, namePath);
    return namePath.length ? cloneDeep(initValue) : initValue;
  };

  private setPreserve = (preserve?: boolean) => {
    this.#preserve = preserve;
  };

  private isMergedPreserve = (fieldPreserve?: boolean) => {
    const mergedPreserve = fieldPreserve !== undefined ? fieldPreserve : this.#preserve;
    return mergedPreserve ?? true;
  };

  // =================== store ===================

  private updateStore = (nextStore: T) => {
    this.#store = nextStore;
  };

  // =================== field  ===================

  private getFieldValue = (name: NamePath) => getValue(this.#store, name);

  private getFieldsValue = (nameCollection?: NameCollection) => {
    if (!nameCollection?.getStoreAll) {
      return this.#store;
    }
    const nameList = nameCollection
      ? this.#fieldEntities
      : getNamePathByNameCollection(nameCollection, this.#fieldEntities);
    return nameList.reduce<Partial<T>>((pre, { getNamePath }) => {
      const name = getNamePath();
      return set(pre, name, this.getFieldValue(name));
    }, {});
  };

  private setFieldValue = (name: NamePath, value: any) => {
    const prevStore = this.#store;
    setValue(this.#store, name, value);
    this.#valueObserver.dispatch({
      prevStore,
      info: { type: 'setField', source: 'external' },
      namePathList: [name],
    });
  };

  private setFieldsValue = (value: Partial<T>) => {
    const prevStore = this.#store;
    this.#store = merge({}, this.#store, value);
    this.#valueObserver.dispatch({
      prevStore,
      info: {
        type: 'setField',
        source: 'external',
      },
    });
  };

  private resetFields = (nameCollection?: NameCollection) => {
    const prevStore = this.#store;
    if (!nameCollection) {
      this.#store = cloneDeep(this.#initialValues);
      this.#valueObserver.dispatch({
        prevStore,
        info: { type: 'reset' },
      });
      return;
    }
    const nameList = getNamePathByNameCollection(nameCollection, this.#fieldEntities);
    nameList.forEach(({ getNamePath: getName }) => {
      const name = getName();
      const initValue = this.getInitialValue(getNamePath(name));
      setValue(this.#store, name, initValue);
    });
    this.#valueObserver.dispatch({
      prevStore,
      info: { type: 'reset' },
      namePathList: nameList.map(({ getNamePath }) => getNamePath()),
    });
  };

  // =================== validate ===================
  private validateFields = (nameCollection?: NameCollection) => {
    const promiseList: Promise<any>[] = [];
    if (!nameCollection) {
      this.#fieldEntities.forEach((entity) => {
        promiseList.push(entity.validate());
      });
    }
  };
}
export default Form;
