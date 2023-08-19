import { NamePath, Store } from '@hedone/form-core';
import { FormBasicProps, FormProps } from './form';
import { ReactNode } from 'react';
import { FormFieldProps } from './field';

export interface FormGroupProps extends FormBasicProps, Pick<FormProps<Store>, 'layout'> {
	name?: NamePath;
	nameToPreFix?: boolean;
	columns?: FormFieldProps[];
	children?: ReactNode;
}
