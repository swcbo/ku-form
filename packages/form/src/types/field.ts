import { FormInternalField, NamePath, Store, StoreValue } from '@hedone/form-core';
import { ReactNode } from 'react';
import { FormBasicProps } from './form';
export type EventArgs = any[];
export interface FieldProps extends FormInternalField, FormBasicProps {
  required?: boolean;
  valuePropName?: string;
  trigger?: string;
  renderPreview?: (value: any) => ReactNode;
  label?: ReactNode;
  noStyle?: boolean;
  onValueChange?: (value: any) => void;
  getValueFromEvent?: (...args: EventArgs) => StoreValue;
  normalize?: (value: StoreValue, prevValue: StoreValue, allValues: Store) => any;
}
export interface FieldInstance {
  prefixName?: NamePath;
  props: FormBasicProps;
}
