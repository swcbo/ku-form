import { cloneDeep, merge, set } from 'lodash-es';
import Observer from '../plugins/observer';
import genProxy from '../plugins/proxy';
import {
	Callbacks,
	FieldEntity,
	InternalFormInstance,
	InternalHooks,
	InternalNamePath,
	NameCollection,
	NamePath,
	ReducerAction,
	Store,
	StoreValue,
	UpdateAction,
	ValidateError,
	ValidateParams,
	WatchCallBack,
} from '../type';
import { getFieldEntitiesByCollection } from '../utils/namePathUtils';
import { getValue, setValue } from '../utils/valueUtils';
import { getNamePath } from './../utils/typeUtils';

class Form<T extends Store> {
	#store: T = {} as T;
	#initialValues: T = {} as T;
	#fieldEntities: Map<string, FieldEntity> = new Map();
	#groupMap: Map<string, Map<string, FieldEntity>> = new Map();
	#observer = new Observer<T>();
	#preserve?: boolean;
	#callbacks: Callbacks<T> = {};
	#watchMap: Map<symbol, WatchCallBack> = new Map();

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
				merge(this.#store, values);
			}
		}
	};

	private registerField = (entity: FieldEntity) => {
		const namePath = entity.getNamePath();
		if (namePath) {
			entity.groupNames.forEach((groupName) => {
				const map = this.#groupMap.get(groupName) || new Map();
				map.set(`${namePath}`, entity);
				this.#groupMap.set(groupName, map);
			});

			this.#fieldEntities.set(`${namePath}`, entity);
			const unSubscribe = this.#observer.subscribe(entity.onStoreChange);
			if (entity.props?.initialValue) {
				const formInitialValue = this.getInitialValue(namePath);
				if (formInitialValue !== undefined) {
					console.warn('Form already set initial value, field can not overwrite it.');
				} else {
					this.setFieldValue(namePath, entity.props.initialValue);
					this.triggerWatch([namePath]);
				}
			} else {
				this.triggerWatch([namePath]);
			}

			return () => {
				this.#fieldEntities.delete(`${namePath}`);
				entity.groupNames.forEach((groupName) => {
					const map = this.#groupMap.get(groupName);
					if (map) {
						map.delete(`${namePath}`);
					}
				});
				unSubscribe();
				if (!this.isMergedPreserve(entity.isPreserve())) {
					if (namePath) {
						const defaultValue = this.getInitialValue(namePath);
						set(this.#store, namePath, defaultValue);
					}
				} else {
					this.triggerWatch([namePath]);
				}
			};
		}
	};

	// ================= watch ==================
	private registerWatch: InternalHooks<T>['registerWatch'] = (callback) => {
		const symbol = Symbol('watch');
		this.#watchMap.set(symbol, callback);
		return () => {
			this.#watchMap.delete(symbol);
		};
	};

	private triggerWatch = (namePathList: InternalNamePath[] = []) => {
		if (this.#watchMap.size === 0) return;
		const values = this.getFieldsValue() as T;
		const allValues = this.getFieldsValue({
			getStoreAll: true,
		}) as T;
		this.#watchMap.forEach((fun) => {
			fun({ values, allValues, namePathList });
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
				}).catch((errorInfo) => {
					console.warn('form validate error', errorInfo.cause);
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
			onValuesChange(
				set({}, namePath, changedValues),
				this.getFieldsValue() as T,
				source,
			);
		}
	};

	// =================== field  ===================

	private getFieldValue = (name: NamePath) => getValue(this.#store, name);

	private getFieldsValue = (nameCollection?: NameCollection) => {
		if (nameCollection?.getStoreAll) {
			return this.#store;
		}
		const entityList = !nameCollection
			? [...this.#fieldEntities.values()]
			: getFieldEntitiesByCollection(nameCollection, this.#fieldEntities, this.#groupMap);

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
		merge(this.#store, prevStore, value);
		this.#observer.dispatch({
			prevStore,
			info: {
				type: 'valueUpdate',
				source: 'external',
			},
		});
	};

	private resetFields = (nameCollection?: Omit<NameCollection, 'getStoreAll'>) => {
		const prevStore = cloneDeep(this.#store);
		const nameList = getFieldEntitiesByCollection(
			nameCollection,
			this.#fieldEntities,
			this.#groupMap,
		).map(({ getNamePath }) => getNamePath());
		nameList.forEach((name) => {
			if (name) {
				set(this.#store, name, this.getInitialValue(name));
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
	};

	private isFieldsTouched = (nameCollection?: Omit<NameCollection, 'getStoreAll'>) => {
		const entityList = getFieldEntitiesByCollection(
			nameCollection,
			this.#fieldEntities,
			this.#groupMap,
		);
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
					onFinishFailed(errorInfo.cause);
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
		const promiseList: Promise<ValidateError | undefined>[] = [];
		const collection = {
			nameList,
			groupName,
		};
		const entityList = getFieldEntitiesByCollection(
			collection,
			this.#fieldEntities,
			this.#groupMap,
		);
		entityList.forEach((entity) => {
			if (entity.validate) {
				promiseList.push(
					entity.validate({
						...options,
						...other,
					}),
				);
			}
		});
		const returnPromise = Promise.all(promiseList);
		return returnPromise.then((validates) => {
			const values = this.getFieldsValue(collection);
			const errorFields = validates.filter((v) => v);
			if (errorFields.length > 0) {
				const error = new Error('Fields validate error', {
					cause: {
						values,
						errorFields,
					},
				});
				throw error;
			}
			return values;
		});
	};
}
export default Form;
