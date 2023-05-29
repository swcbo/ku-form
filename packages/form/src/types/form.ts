import { FormInstance, Store, Callbacks, InternalFormInstance } from '@hedone/form-core';
import { ReactNode } from 'react';
export interface FormBasicProps {
  editable?: boolean;
  disabled?: boolean;
  colon?: boolean;
  preserve?: boolean;
  validateTrigger?: string | string[];
}

export interface FormContextStore extends InternalFormInstance, FormBasicProps {}

export interface FormProps<T extends Store = Store>
  extends FormBasicProps,
    Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children' | 'onReset'>,
    Callbacks<T> {
  layout?: 'horizontal' | 'vertical' | 'inline';
  initialValues?: Partial<T>;
  onValuesChange?: (changedValues: Partial<T>, values: T) => void;
  form?: FormInstance<T>;
  children?: ReactNode;
}

export type FormRef = FormInstance;
