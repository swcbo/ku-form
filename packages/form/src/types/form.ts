import { FormInstance } from '@hedone/form-core';
import { StoreValue, FormBasicProps } from '@hedone/form-core/typings/type';
import { ReactNode } from 'react';

export interface FormProps<T extends StoreValue = StoreValue>
  extends FormBasicProps,
    Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'> {
  layout?: 'horizontal' | 'vertical' | 'inline';
  initialValues?: Partial<T>;
  validateTrigger?: string | string[];
  onValuesChange?: (changedValues: Partial<T>, values: T) => void;
  onFinish?: (values: T) => void;
  form?: FormInstance<T>;
  children?: ReactNode;
}
