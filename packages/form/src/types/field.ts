import { RuleItem } from 'async-validator';
import {
	FormInternalField,
	InternalNamePath,
	Store,
	StoreValue,
} from '@hedone/form-core';
import { ReactNode } from 'react';
import { FormBasicProps, FormContextStore, FormProps } from './form';
export type EventArgs = StoreValue[];
export type FieldMate = {
	errors: string[];
	touched: boolean;
	visible: boolean;
	props?: FormFieldProps;
};

export interface RenderFieldProps<T extends Store>
	extends FormBasicProps,
		Pick<FormFieldProps<T>, 'label'> {
	value?: StoreValue;
	onChange?: StoreValue;
	[key: string]: StoreValue;
}
export interface FormFieldProps<T extends Store = Store>
	extends FormInternalField,
		FormBasicProps {
	required?: boolean | (() => boolean);
	valuePropName?: string;
	trigger?: string;
	renderPreview?: (props: RenderFieldProps<T>) => ReactNode;
	rules?: RuleItem[];
	label?: ReactNode;
	noStyle?: boolean;
	onValueChange?: (value: StoreValue) => void;
	getValueFromEvent?: (...args: EventArgs) => StoreValue;
	normalize?: (
		value: StoreValue,
		prevValue: StoreValue,
		allValues: Store,
	) => StoreValue;
	onReset?: () => void;
	field?: string;
	children?: ReactNode | ((p?: T) => ReactNode);
	fieldProps?: T;
}

export interface FieldInternalField extends FormFieldProps {
	internalName?: InternalNamePath;
}
export interface FieldInstance
	extends FormBasicProps,
		Pick<FormProps<Store>, 'layout'>,
		FieldInternalField {
	groupNames?: string[];
	formContext: FormContextStore;
	prefixName?: InternalNamePath;
}
