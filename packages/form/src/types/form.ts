import { FormInstance, Store, FormBasicProps } from '@hedone/form-core';
import { Callbacks } from '@hedone/form-core/typings/type';
import { ReactNode } from 'react';

export interface FormProps<T extends Store = Store>
  extends FormBasicProps,
    Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'>,
    Callbacks<T> {
  layout?: 'horizontal' | 'vertical' | 'inline';
  initialValues?: Partial<T>;
  validateTrigger?: string | string[];
  onValuesChange?: (changedValues: Partial<T>, values: T) => void;
  form?: FormInstance<T>;
  children?: ReactNode;
  preserve?: boolean;
}
