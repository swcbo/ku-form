import { Rule } from 'async-validator';
import {
	FormInstance,
	FormInternalField,
	InternalNamePath,
	Store,
	StoreValue,
} from '@hedone/form-core';
import { ReactNode } from 'react';
import { FormBasicProps } from './form';
export type EventArgs = StoreValue[];
export type FieldMate = {
	errors: string[];
	touched: boolean;
};
export interface FormFieldProps extends FormInternalField, FormBasicProps {
	required?: boolean | (() => boolean);
	valuePropName?: string;
	trigger?: string;
	renderPreview?: (value: StoreValue) => ReactNode;
	rules?: Rule[];
	label?: ReactNode;
	noStyle?: boolean;
	onValueChange?: (value: StoreValue) => void;
	getValueFromEvent?: (...args: EventArgs) => StoreValue;
	normalize?: (value: StoreValue, prevValue: StoreValue, allValues: Store) => StoreValue;
	onReset?: () => void;
	children?: ReactNode | ((props: Store, form: FormInstance) => ReactNode);
}
export interface FieldInternalField extends FormFieldProps {
	internalName: InternalNamePath;
}
export interface FieldInstance extends FormBasicProps {
	groupNames?: string[];
	prefixName?: InternalNamePath;
}
