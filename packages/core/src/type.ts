import { FormFieldProps } from './../../form/src/types/field';
import { ISubscribeFunType } from './plugins/observer';
export type InternalNamePath = (string | number)[];
export type NamePath = string | number | InternalNamePath;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StoreValue = any;
export type Store = Record<string | number, StoreValue>;

export type NameCollection = {
	nameList?: NamePath[];
	groupName?: NamePath;
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
export type GetValueTypeByInternalNamePath<T, K> = K extends keyof T
	? T[K]
	: K extends [infer L, ...infer R]
		? L extends keyof T
			? GetValueTypeByInternalNamePath<T[L], R>
			: T
		: T;

export type GetValueTypeByNamePath<T, N> = N extends InternalNamePath
	? GetValueTypeByInternalNamePath<T, N>
	: N extends keyof T
		? T[N]
		: never;

export interface FormInstance<T extends Store = Store> {
	// todo 根据 T 与 NamePath 的关系，推导出 返回值 的类型
	getFieldValue: <const NP extends NamePath>(name: NP) => GetValueTypeByNamePath<T, NP>;
	getFieldsValue: (collection?: NameCollection) => Partial<T>;
	// todo 根据 T 与 NamePath 的关系，推导出 value 的类型
	setFieldValue: <const NP extends NamePath>(
		name: NP,
		value: GetValueTypeByNamePath<T, NP>,
	) => void;
	setFieldsValue: (values: ValuesInT<T>) => void;
	resetFields: (collection?: Omit<NameCollection, 'getStoreAll'>) => void;
	validateFields: (options?: ValidateParams) => Promise<Partial<T>>;
	isFieldsTouched: (validate?: Omit<NameCollection, 'getStoreAll'>) => boolean;
	// setInitValue: (values: ValuesInT<T>) => void;
	submit: () => void;
}

export interface ValidateError {
	name: InternalNamePath;
	errors: string[];
}

export interface ValidateErrorEntity<T extends StoreValue> {
	values: T;
	errorFields: ValidateError[];
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
export type WatchCallBack = <T extends Store>(data: {
	values: Partial<T>;
	allValues: T;
	namePathList: InternalNamePath[];
}) => void;
export interface InternalHooks<T extends Store> {
	registerField: (entity: FieldEntity) => (() => void) | undefined;
	setInitialValues: (values: T, init: boolean) => void;
	setPreserve: (preserve?: boolean) => void;
	getInitialValue: (namePath: InternalNamePath) => T;
	setCallbacks: (callbacks: Callbacks<T>) => void;
	dispatch: (action: ReducerAction) => void;
	registerWatch: (callback: WatchCallBack) => void;
}

export interface InternalFormInstance<T extends Store = Store>
	extends Omit<FormInstance<T>, 'clearValidate'> {
	getInternalHooks: () => InternalHooks<T>;
	validateTrigger?: string | string[];
}

// ==================== props =================

export interface FormInternalField {
	name?: NamePath;
	dependency?: TDependency[];
	initialValue?: StoreValue;
}

// ==================== dependency ====================
export type TDependency = {
	relates: ((prefixName: NamePath) => NamePath[]) | NamePath[];
} & (
	| {
			setUp: (
				values: StoreValue[],
				options: {
					setProps: (props: FormFieldProps) => void;
				},
			) => Promise<boolean | void> | boolean | void;
	  }
	| {
			type: 'visible';
			setUp: (values: StoreValue[]) => Promise<boolean> | boolean;
	  }
	| {
			type: 'props';
			setUp: (values: StoreValue[]) => Promise<FormFieldProps> | FormFieldProps;
	  }
	| {
			type: 'value';
			setUp: (values: StoreValue[]) => Promise<StoreValue> | StoreValue;
	  }
);

// ==================== entity ====================

export interface FieldInjectProps {
	[name: string]: unknown;
}

export interface FieldEntity {
	onStoreChange: ISubscribeFunType<ValueChangeParams<Store>>;
	isFieldTouched?: () => boolean;
	getNamePath: () => InternalNamePath | undefined;
	isPreserve: () => boolean | undefined;
	validate?: (options?: ValidateOptions) => Promise<ValidateError | undefined>;
	getMeta?: () => Meta;
	props?: FormInternalField;
	groupNames: string[];
}

// ==================== value change ====================
type ResetInfo = {
	type: 'reset';
};

type RemoveInfo = {
	type: 'remove';
};

export type ValueUpdateInfo = {
	type: 'valueUpdate';
	source: 'internal' | 'external' | 'register';
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
