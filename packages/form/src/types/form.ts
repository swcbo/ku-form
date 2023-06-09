import { FormInstance, Store, Callbacks, InternalFormInstance } from '@hedone/form-core';
import { ReactNode } from 'react';
export interface FormBasicProps {
	editable?: boolean;
	disabled?: boolean;
	colon?: boolean;
	preserve?: boolean;
	validateTrigger?: string | string[];
}

export interface FormContextStore<T extends Store = Store>
	extends InternalFormInstance<T>,
		FormBasicProps {}

export interface FormProps<T extends Store>
	extends FormBasicProps,
		Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'>,
		Callbacks<T> {
	layout?: 'horizontal' | 'vertical' | 'inline';
	initialValues?: Partial<T>;
	onValuesChange?: (changedValues: Partial<T>, values: T) => void;
	form?: FormInstance<T>;
	Component?: string;
	children?: ReactNode;
}

export type FormRef<T extends Store> = FormInstance<T>;
