import { Rule, Values } from 'async-validator';
import { ReactNode } from 'react';
export type InternalNamePath = (string | number)[];
export type NamePath = string | number | InternalNamePath;

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

export interface FormInstance<T extends StoreValue = StoreValue> {
  getFieldValue: (name: NamePath) => any;
  getFieldsValue: (collection?: NameCollection) => Partial<T>;
  setFieldValue: (name: NamePath, value: any) => void;
  setFieldsValue: (values: ValuesInT<T>) => void;
  resetFields: (collection?: Omit<NameCollection, 'getStoreAll'>) => void;
  validateFields: (options?: ValidateParams) => Promise<Partial<T>>;
  isFieldsTouched: (validate?: Omit<NameCollection, 'getStoreAll'>) => boolean;
  // setInitValue: (values: ValuesInT<T>) => void;
  submit: () => void;
}

export interface ValidateErrorEntity<T extends StoreValue = StoreValue> {
  values: T;
  errorFields: { name: InternalNamePath; errors: string[] }[];
  outOfDate: boolean;
}

export interface Callbacks<T> {
  onValuesChange?: (
    changedValues: Partial<T>,
    values: T,
    source: UpdateAction['source'],
  ) => void;
  onFinish?: (values: Partial<T>) => void;
  onFinishFailed?: (errorInfo: ValidateErrorEntity<T>) => void;
}
// ============== internal =====================================

export interface InternalHooks<T extends StoreValue = StoreValue> {
  registerField: (entity: FieldEntity) => () => void;
  setInitialValues: (values: T, init: boolean) => void;
  setPreserve: (preserve?: boolean) => void;
  getInitialValue: (namePath: InternalNamePath) => T;
  setCallbacks: (callbacks: Callbacks<T>) => void;
  dispatch: (action: ReducerAction) => void;
}

export interface InternalFormInstance<T extends StoreValue = StoreValue>
  extends Omit<FormInstance<T>, 'clearValidate'> {
  getInternalHooks: () => InternalHooks<T>;
  validateTrigger?: string | string[];
}

// ==================== props =================

export interface FormInternalField {
  name?: NamePath;
  dependency?: Dependency[];
  rules?: Rule[];
  initialValue?: any;
  list?: FormInternalField[];
  fieldType?: 'scope';
  children?:
    | ReactNode
    | ((props: FieldInjectProps, form: FormInstance<Values>) => ReactNode);
}

// ==================== dependency ====================
export interface Dependency {
  type: 'value' | 'visible' | 'disabled';
}

// ==================== entity ====================

export interface FieldInjectProps {
  [name: string]: any;
}

export interface FieldEntity {
  isFieldTouched?: () => boolean;
  getNamePath: () => InternalNamePath | undefined;
  isPreserve: () => boolean | undefined;
  validate?: (options?: ValidateOptions) => Promise<ValidateErrorEntity>;
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
export interface ValueChangeParams<T extends StoreValue> {
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
