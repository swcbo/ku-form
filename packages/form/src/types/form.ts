import {
	FormInstance,
	Store,
	Callbacks,
	InternalFormInstance,
	StoreValue,
} from '@hedone/form-core';
import { ReactNode } from 'react';
export interface FormBasicProps {
	editable?: boolean;
	disabled?: boolean;
	colon?: boolean;
	preserve?: boolean;
	className?: string;
	style?: React.CSSProperties;
	validateTrigger?: string | string[];
	labelAlign?: 'left' | 'right';
}
export type LayoutType = 'horizontal' | 'vertical' | 'inline';

export interface FormProps<T extends Store = Store>
	extends FormBasicProps,
		Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'>,
		Omit<Callbacks<T>, 'onValuesChange'> {
	initialValues?: Partial<T>;
	onValuesChange?: (changedValues: StoreValue, values: T) => void;
	form?: FormInstance<T>;
	Component?: string;
	children?: ReactNode;
	layout?: LayoutType;
}

export interface FormContextStore<T extends Store = Store>
	extends InternalFormInstance<T>,
		FormProps<T> {}

export type FormRef<T extends Store> = FormInstance<T>;
