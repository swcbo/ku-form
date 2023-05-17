import { Rule, Values } from 'async-validator';
import { ReactNode } from 'react';
export type InternalNamePath = (string | number)[];
export type NamePath = string | number | InternalNamePath;

export type StoreValue = any;
export type Store = Record<string, StoreValue>;

export type NameCollection = {
  nameList?: NamePath[];
  groupName?: NamePath;
  getStoreAll?: boolean; // 获取store里面的所有值
};

export type GroupMap = Record<
  string,
  {
    fieldPaths: NamePath[];
    entity: GroupEntity;
  }
>;

export type ValuesInT<T extends StoreValue> = {
  [key in keyof T]: T[key];
};

export interface FormInstance<T extends StoreValue = StoreValue> {
  getFieldValue: (name: NamePath) => any;
  getFieldsValue: (collection?: NameCollection) => T;
  setFieldValue: (name: NamePath, value: any) => void;
  setFieldsValue: (values: ValuesInT<T>) => void;
  resetFields: (collection?: NameCollection) => void;
  clearValidate: (collection?: NameCollection) => void;
  validateFields: (collection?: NameCollection) => Promise<T>;
  isFieldsTouched: (validate?: NameCollection) => boolean;
  setInitValue: (values: ValuesInT<T>) => void;
  submit: () => void;
  setInitialValues: (values: T) => void;
}

export interface FormBasicProps {
  /** 是否编辑 默认true */
  editable?: boolean;
  disabled?: boolean;
  colon?: boolean;
  /** 当字段被删除时保留字段值 */
  preserve?: boolean;
}

export interface FormProps<T extends StoreValue = StoreValue> extends FormBasicProps {
  layout?: 'horizontal' | 'vertical' | 'inline';
  initialValues?: Partial<T>;
  validateTrigger?: string | string[];
  onValuesChange?: (changedValues: Partial<T>, values: T) => void;
  onFinish?: (values: T) => void;
  form?: FormInstance;
}

export interface FormGroup extends FormBasicField, FormBasicProps {
  list: FormField[];
  name: NamePath;
}

export interface FormField extends FormBasicField, FormBasicProps {
  rules?: Rule[];
  required?: boolean;
  valuePropName?: string;
  trigger?: string;
  renderPreview?: (value: any) => React.ReactNode;
  label?: React.ReactNode;
  initialValue?: any;
  noStyle?: boolean;
  field: string;
  children?: ReactNode | ((props: ChildProps, form: FormInstance<Values>) => ReactNode);
}

export interface InternalKuFormInstance
  extends Omit<FormInstance, 'validateFields' | 'clearValidate'> {}

export interface Dependency {
  type: 'value' | 'visible' | 'disabled';
}

export interface FormBasicField {
  name?: NamePath;
  dependency?: Dependency[];
}

interface ChildProps {
  [name: string]: any;
}

export interface FieldEntity {
  isFieldTouched: () => boolean;
  getGroupNamePath: () => InternalNamePath | undefined;
  getNamePath: () => InternalNamePath;
  isPreserve: () => boolean | undefined;
  validate: () => Promise<any[]>;
  props: Pick<FormField, 'name' | 'rules' | 'dependency' | 'initialValue'>;
}

export interface GroupEntity {
  getNamePath: () => InternalNamePath;
  props: Pick<FormGroup, 'name' | 'dependency'>;
}
// ==================== value change ====================
type ResetInfo = {
  type: 'reset';
};

type RemoveInfo = {
  type: 'remove';
};

type SetFieldInfo = {
  type: 'setField';
  source: 'internal' | 'external' | 'reset';
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
  | SetFieldInfo
  | DependenciesUpdateInfo
  | ClearValidateInfo
  | ValidateInfo;
export interface ValueChangeParams<T extends StoreValue> {
  info: ValueChangeInfo;
  prevStore?: T;
  namePathList?: NamePath[];
}
