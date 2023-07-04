import { Rule } from 'async-validator';
import { ISubscribeFunType } from './plugins/observer';
export type InternalNamePath = (string | number)[];
export type NamePath = string | number | InternalNamePath;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StoreValue = any;
export type Store = Record<string, StoreValue>;

export type NameCollection = {
	nameList?: NamePath[];
	scopeName?: NamePath;
	getStoreAll?: boolean; // 获取store里面的所有值
};

export type ScopeMap = Record<
	string,
	{
		fieldPaths: NamePath[];
		entity: FieldEntity;
	}
>;

export type ValuesInT<T extends StoreValue> = {
	[key in keyof T]: T[key];
};
export interface ValidateParams extends Omit<NameCollection, 'getStoreAll'> {
	options?: ValidateOptions;
	triggerName?: string;
}
export interface ValidateOptions {
	/** not trigger status update */
	validateOnly?: boolean;
}

export interface Meta {
	touched: boolean;
	validating: boolean;
	errors: string[];
	name: InternalNamePath;
	validated: boolean;
}
export interface FormInstance<T extends Store = Store> {
	// todo 根据 T 与 NamePath 的关系，推导出 返回值 的类型
	getFieldValue: <const NP extends NamePath>(name: NP) => StoreValue;
	getFieldsValue: (collection?: NameCollection) => Partial<T>;
	// todo 根据 T 与 NamePath 的关系，推导出 value 的类型
	setFieldValue: <const NP extends NamePath>(name: NP, value: StoreValue) => void;
	setFieldsValue: (values: ValuesInT<T>) => void;
	resetFields: (collection?: Omit<NameCollection, 'getStoreAll'>) => void;
	validateFields: (options?: ValidateParams) => Promise<Partial<T>>;
	isFieldsTouched: (validate?: Omit<NameCollection, 'getStoreAll'>) => boolean;
	// setInitValue: (values: ValuesInT<T>) => void;
	submit: () => void;
}

export interface ValidateErrorEntity<T extends StoreValue> {
	values: T;
	errorFields: { name: InternalNamePath; errors: string[] }[];
	outOfDate: boolean;
}

export interface Callbacks<T extends Store> {
	onValuesChange?: (
		changedValues: Partial<T>,
		values: T,
		source: UpdateAction['source'],
	) => void;
	onFinish?: (values: Partial<T>) => void;
	onFinishFailed?: (errorInfo: ValidateErrorEntity<T>) => void;
}
// ============== internal =====================================
export type WatchCallBack = (
	values: Store,
	allValues: Store,
	namePathList: InternalNamePath[],
) => void;
export interface InternalHooks<T extends Store> {
	registerField: (entity: FieldEntity) => () => void;
	setInitialValues: (values: T, init: boolean) => void;
	setPreserve: (preserve?: boolean) => void;
	getInitialValue: (namePath: InternalNamePath) => T;
	setCallbacks: (callbacks: Callbacks<T>) => void;
	dispatch: (action: ReducerAction) => void;
	registerWatch: (callback: WatchCallBack) => void;
}

export interface InternalFormInstance<T extends Store>
	extends Omit<FormInstance<T>, 'clearValidate'> {
	getInternalHooks: () => InternalHooks<T>;
	validateTrigger?: string | string[];
}

// ==================== props =================

export interface FormInternalField {
	name?: NamePath;
	dependency?: Dependency[];
	rules?: Rule[];
	initialValue?: StoreValue;
	list?: FormInternalField[];
	fieldType?: 'scope';
}

// ==================== dependency ====================
export interface Dependency {
	type: 'value' | 'visible' | 'disabled';
}

// ==================== entity ====================

export interface FieldInjectProps {
	[name: string]: unknown;
}

export interface FieldEntity {
	onStoreChange: ISubscribeFunType<ValueChangeParams<Store>>;
	isFieldTouched?: () => boolean;
	getNamePath: () => InternalNamePath;
	isPreserve: () => boolean | undefined;
	validate?: (options?: ValidateOptions) => Promise<ValidateErrorEntity<StoreValue>>;
	getMeta?: () => Meta;
	props?: FormInternalField;
}

// ==================== value change ====================
type ResetInfo = {
	type: 'reset';
};

type RemoveInfo = {
	type: 'remove';
};

type ValueUpdateInfo = {
	type: 'valueUpdate';
	source: 'internal' | 'external';
};

type DependenciesUpdateInfo = {
	type: 'dependenciesUpdate';
	relatedFields: InternalNamePath[];
};
type ClearValidateInfo = {
	type: 'clearValidate';
};
type ValidateInfo = {
	type: 'validate';
};
export type ValueChangeInfo =
	| ResetInfo
	| RemoveInfo
	| ValueUpdateInfo
	| DependenciesUpdateInfo
	| ClearValidateInfo
	| ValidateInfo;
export interface ValueChangeParams<T extends Store> {
	info: ValueChangeInfo;
	prevStore?: T;
	namePathList?: NamePath[];
}

// ==================== action ====================

export interface UpdateAction {
	type: 'updateValue';
	namePath: InternalNamePath;
	value: StoreValue;
	source: 'trigger' | 'dependency';
}

interface ValidateAction {
	type: 'validateField';
	namePath: InternalNamePath;
	triggerName: string;
}

export type ReducerAction = UpdateAction | ValidateAction;
