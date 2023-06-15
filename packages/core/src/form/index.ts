import { getNamePath } from './../utils/typeUtils';
import { cloneDeep, merge, omit, set } from 'lodash-es';
import {
  FieldEntity,
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
  WatchCallBack,
} from '../type';
import { getFieldEntitiesByCollection } from '../utils/namePathUtils';
import { getValue, setValue } from '../utils/valueUtils';
import Observer from '../plugins/observer';
import genProxy from '../plugins/proxy';

class Form<T extends Store = Store> {
  #store: T = {} as T;
  #initialValues: T = {} as T;
  #fieldEntities: FieldEntity[] = [];
  #scopeMap: Map<string, FieldEntity> = new Map();
  #observer = new Observer<ValueChangeParams<T>>();
  #preserve?: boolean;
  #callbacks: Callbacks<T> = {};
  #watchMap: Map<Symbol, WatchCallBack> = new Map();

  // ============== init or register =======================

  constructor(initialValues?: T) {
    if (initialValues) {
      if (typeof initialValues === 'object') {
        this.updateStore(cloneDeep(initialValues));
      } else {
        console.warn('initialValues must be an Object.');
      }
    } else {
      this.proxyStore(this.#store);
    }
  }

  private setInitialValues = (values?: T, init?: boolean) => {
    if (values) {
      this.#initialValues = values;
      if (init) {
        this.updateStore(cloneDeep(values));
        this.triggerWatch();
      }
    }
  };

  private registerField = (entity: FieldEntity) => {
    const isScope = entity.props?.fieldType === 'scope';
    if (isScope) {
      if (!entity.props?.name) {
        console.warn('Scope field must have a name.');
        return () => {};
      }
      const scopePath = `${entity.props.name}`;
      this.#scopeMap.set(scopePath, entity);
      return () => {
        this.#scopeMap.delete(scopePath);
      };
    } else {
      this.#fieldEntities.push(entity);
      const namePath = entity.getNamePath();
      if (namePath.length) {
        if (entity.props?.initialValue) {
          const formInitialValue = this.getInitialValue(namePath);
          if (formInitialValue !== undefined) {
            console.warn('Form already set initial value, field can not overwrite it.');
          } else {
            this.setFieldValue(namePath, entity.props.initialValue);
          }
        } else {
          this.triggerWatch([namePath]);
        }
      }
      const unSubscribe = this.#observer.subscribe(entity.onStoreChange);

      return () => {
        this.#fieldEntities = this.#fieldEntities.filter((item) => item !== entity);
        unSubscribe();
        if (!this.isMergedPreserve(entity.isPreserve())) {
          const namePath = entity.getNamePath();
          if (namePath) {
            const defaultValue = this.getInitialValue(namePath);
            if (defaultValue) {
              set(this.#store, namePath, defaultValue);
            } else {
              this.updateStore(omit(this.#store, namePath) as T);
            }
          }
        }
      };
    }
  };

  // ================= watch ==================

  private registerWatch: InternalHooks['registerWatch'] = (callback) => {
    const symbol = Symbol('watch');
    this.#watchMap.set(symbol, callback);
    return () => {
      this.#watchMap.delete(symbol);
    };
  };

  private triggerWatch = (namePathList: InternalNamePath[] = []) => {
    if (this.#watchMap.size === 0) return;
    const values = this.getFieldsValue();
    const allValues = this.getFieldsValue({
      getStoreAll: true,
    });
    this.#watchMap.forEach((callback) => {
      callback(values, allValues, namePathList);
    });
  };

  private proxyStore = (store: T) => {
    this.#store = genProxy(store, this.triggerWatch);
  };

  // =================== get hooks  ===================

  private getInitialValue = (namePath: InternalNamePath) => {
    const initValue = getValue(this.#initialValues, namePath);
    return namePath.length ? cloneDeep(initValue) : initValue;
  };

  private isMergedPreserve = (fieldPreserve?: boolean) => {
    const mergedPreserve = fieldPreserve ?? this.#preserve;
    return mergedPreserve ?? true;
  };

  public getForm = (): InternalFormInstance<T> => ({
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
      setInitialValues: this.setInitialValues,
      getInitialValue: this.getInitialValue,
      setPreserve: this.setPreserve,
      dispatch: this.dispatch,
      setCallbacks: this.setCallbacks,
      registerWatch: this.registerWatch,
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
    this.proxyStore(nextStore);
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
    const prevStore = cloneDeep(this.#store);
    set(this.#store, namePath, value);
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
  };

  // =================== field  ===================

  private getFieldValue = (name: NamePath) => getValue(this.#store, name);

  private getFieldsValue = (nameCollection?: NameCollection) => {
    if (nameCollection?.getStoreAll) {
      return this.#store;
    }
    const entityList = nameCollection
      ? this.#fieldEntities
      : getFieldEntitiesByCollection(nameCollection, this.#fieldEntities);
    return entityList.reduce<Partial<T>>((pre, { getNamePath }) => {
      const name = getNamePath();
      if (!name) return pre;
      return set(pre, name, this.getFieldValue(name));
    }, {});
  };

  private setFieldValue = (name: NamePath, value: StoreValue) => {
    const prevStore = cloneDeep(this.#store);

    setValue(this.#store, name, value);
    this.#observer.dispatch({
      prevStore,
      info: { type: 'valueUpdate', source: 'external' },
      namePathList: [name],
    });
  };

  private setFieldsValue = (value: Partial<T>) => {
    const prevStore = cloneDeep(this.#store);
    this.updateStore(merge({}, prevStore, value));
    this.#observer.dispatch({
      prevStore,
      info: {
        type: 'valueUpdate',
        source: 'external',
      },
    });
    this.triggerWatch();
  };

  private resetFields = (nameCollection?: Omit<NameCollection, 'getStoreAll'>) => {
    const prevStore = cloneDeep(this.#store);
    const nameList = getFieldEntitiesByCollection(
      nameCollection,
      this.#fieldEntities,
    ).map(({ getNamePath }) => getNamePath());
    nameList.forEach((name) => {
      if (name) {
        this.updateStore(set(this.#store, name, this.getInitialValue(name)));
      }
    });
    this.#observer.dispatch({
      prevStore,
      info: { type: 'reset' },
      namePathList: nameList.reduce<NamePath[]>((pre, name) => {
        if (!name) return pre;
        return [...pre, name];
      }, []),
    });
    this.triggerWatch(nameList);
  };

  private isFieldsTouched = (nameCollection?: Omit<NameCollection, 'getStoreAll'>) => {
    const entityList = getFieldEntitiesByCollection(nameCollection, this.#fieldEntities);
    return entityList.some((entity) => entity.isFieldTouched?.());
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
    scopeName,
    options,
    ...other
  }: ValidateParams = {}) => {
    const promiseList: Promise<StoreValue>[] = [];
    const collection = {
      nameList,
      scopeName,
    };
    const entityList = getFieldEntitiesByCollection(collection, this.#fieldEntities);
    entityList.forEach((entity) => {
      if (entity.props?.rules && entity.props.rules.length > 0 && entity.validate) {
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
