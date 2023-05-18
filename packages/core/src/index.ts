import { cloneDeep, merge, set } from 'lodash-es';
import {
  FieldEntity,
  GroupEntity,
  NamePath,
  InternalNamePath,
  NameCollection,
  Store,
  ValueChangeParams,
  InternalFormInstance,
  InternalHooks,
  Callbacks,
  ReducerAction,
  StoreValue,
  UpdateAction,
  ValidateParams,
} from './type';
import { getFieldEntitiesByCollection } from './utils/namePathUtils';
import { getValue, setValue } from './utils/valueUtils';
import Observer from './plugins/observer';
import { getNamePath } from './utils/typeUtils';

class Form<T extends Store = Store> {
  #store: T = {} as T;
  #initialValues: T = {} as T;
  #fieldEntities: FieldEntity[] = [];
  #groupMap: Map<string, GroupEntity> = new Map();
  #observer = new Observer<ValueChangeParams<T>>();
  #preserve?: boolean;
  #callbacks: Callbacks<T> = {};

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
        this.#observer.dispatch({
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

  // =================== get hooks  ===================

  private getInitialValue = (namePath: InternalNamePath) => {
    const initValue = getValue(this.#initialValues, namePath);
    return namePath.length ? cloneDeep(initValue) : initValue;
  };

  private isMergedPreserve = (fieldPreserve?: boolean) => {
    const mergedPreserve = fieldPreserve !== undefined ? fieldPreserve : this.#preserve;
    return mergedPreserve ?? true;
  };

  public getFrom = (): InternalFormInstance<T> => ({
    getFieldValue: this.getFieldValue,
    getFieldsValue: this.getFieldsValue,
    setFieldValue: this.setFieldValue,
    setFieldsValue: this.setFieldsValue,
    resetFields: this.resetFields,
    validateFields: this.validateFields,
    getInternalHooks: this.getInternalHooks,
    isFieldsTouched: this.isFieldsTouched,
    submit: this.submit,
  });

  private getInternalHooks = (): InternalHooks<T> => {
    return {
      registerField: this.registerField,
      registerGroup: this.registerGroup,
      setInitialValues: this.setInitialValues,
      getInitialValue: this.getInitialValue,
      setPreserve: this.setPreserve,
      dispatch: this.dispatch,
      setCallbacks: this.setCallbacks,
    };
  };

  private dispatch = (action: ReducerAction) => {
    switch (action.type) {
      case 'updateValue': {
        const { namePath, value, source } = action;
        this.updateValue(namePath, value, source);
        break;
      }
      case 'validateField': {
        const { namePath, triggerName } = action;
        this.validateFields({
          nameList: [namePath],
          triggerName,
        });
        break;
      }
    }
  };

  // =================== update form ===================

  private updateStore = (nextStore: T) => {
    this.#store = nextStore;
  };

  private setCallbacks = (callbacks: Callbacks<T>) => {
    this.#callbacks = callbacks;
  };

  private setPreserve = (preserve?: boolean) => {
    this.#preserve = preserve;
  };

  private updateValue = (
    name: NamePath,
    value: StoreValue,
    source: UpdateAction['source'],
  ) => {
    const namePath = getNamePath(name);
    const prevStore = this.#store;
    this.updateStore(set(this.#store, namePath, value));

    this.#observer.dispatch({
      prevStore,
      info: { type: 'valueUpdate', source: 'internal' },
      namePathList: [namePath],
    });
    const { onValuesChange } = this.#callbacks;

    if (onValuesChange) {
      const changedValues = getValue(this.#store, namePath);
      onValuesChange(changedValues, this.getFieldsValue() as T, source);
    }

    // this.triggerOnFieldsChange([namePath, ...childrenFields]);
  };

  // =================== field  ===================

  private getFieldValue = (name: NamePath) => getValue(this.#store, name);

  private getFieldsValue = (nameCollection?: NameCollection) => {
    if (!nameCollection?.getStoreAll) {
      return this.#store;
    }
    const entityList = nameCollection
      ? this.#fieldEntities
      : getFieldEntitiesByCollection(nameCollection, this.#fieldEntities);
    return entityList.reduce<Partial<T>>((pre, { getNamePath }) => {
      const name = getNamePath();
      return set(pre, name, this.getFieldValue(name));
    }, {});
  };

  private setFieldValue = (name: NamePath, value: StoreValue) => {
    const prevStore = this.#store;
    setValue(this.#store, name, value);
    this.#observer.dispatch({
      prevStore,
      info: { type: 'valueUpdate', source: 'external' },
      namePathList: [name],
    });
  };

  private setFieldsValue = (value: Partial<T>) => {
    const prevStore = this.#store;
    this.#store = merge({}, this.#store, value);
    this.#observer.dispatch({
      prevStore,
      info: {
        type: 'valueUpdate',
        source: 'external',
      },
    });
  };

  private resetFields = (nameCollection?: Omit<NameCollection, 'getStoreAll'>) => {
    const prevStore = this.#store;
    const entityList = getFieldEntitiesByCollection(nameCollection, this.#fieldEntities);
    entityList.forEach(({ getNamePath: getName }) => {
      const name = getName();
      const initValue = this.getInitialValue(getNamePath(name));
      setValue(this.#store, name, initValue);
    });
    this.#observer.dispatch({
      prevStore,
      info: { type: 'reset' },
      namePathList: entityList.map(({ getNamePath }) => getNamePath()),
    });
  };

  private isFieldsTouched = (nameCollection?: Omit<NameCollection, 'getStoreAll'>) => {
    const entityList = getFieldEntitiesByCollection(nameCollection, this.#fieldEntities);
    return entityList.some((entity) => entity.isFieldTouched());
  };

  private submit = () => {
    const { onFinish, onFinishFailed } = this.#callbacks;
    this.validateFields()
      .then((values) => {
        if (onFinish) {
          onFinish(values);
        }
      })
      .catch((errorInfo) => {
        if (onFinishFailed) {
          onFinishFailed(errorInfo);
        }
      });
  };

  // =================== validate ===================

  private validateFields = async ({
    nameList,
    groupName,
    options,
    ...other
  }: ValidateParams = {}) => {
    const promiseList: Promise<StoreValue>[] = [];
    const collection = {
      nameList,
      groupName,
    };
    const entityList = getFieldEntitiesByCollection(collection, this.#fieldEntities);
    entityList.forEach((entity) => {
      if (entity.props.rules && entity.props.rules.length > 0) {
        promiseList.push(
          entity.validate({
            ...options,
            ...other,
          }),
        );
      }
    });
    const returnPromise = Promise.allSettled(promiseList);

    // TODO: compare last promise

    return returnPromise
      .then((validates) => {
        const errors = validates.filter((item) => item.status === 'rejected');
        const values = this.getFieldsValue(collection);
        if (errors.length > 0) {
          return Promise.reject({
            values,
            errorFields: errors,
          });
        } else {
          return Promise.resolve(values);
        }
      })
      .catch() as Promise<Partial<T>>;
  };
}
export default Form;
