import { NamePath } from '@hedone/form-core';
import { FormBasicProps } from './form';
import { ReactNode } from 'react';
import { FormFieldProps } from './field';

export interface FormGroupProps extends FormBasicProps {
	name?: NamePath;
	nameToPreFix?: boolean;
	columns?: FormFieldProps[];
	children?: ReactNode;
}
