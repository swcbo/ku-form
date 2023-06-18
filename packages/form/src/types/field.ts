import { FormInternalField, NamePath, Store, StoreValue } from '@hedone/form-core';
import { ReactNode } from 'react';
import { FormBasicProps } from './form';
export type EventArgs = StoreValue[];
export interface FieldProps extends FormInternalField, FormBasicProps {
	required?: boolean;
	valuePropName?: string;
	trigger?: string;
	renderPreview?: (value: StoreValue) => ReactNode;
	label?: ReactNode;
	noStyle?: boolean;
	onValueChange?: (value: StoreValue) => void;
	getValueFromEvent?: (...args: EventArgs) => StoreValue;
	normalize?: (value: StoreValue, prevValue: StoreValue, allValues: Store) => StoreValue;
	onReset?: () => void;
}
export interface FieldInstance {
	prefixName?: NamePath;
	props: FormBasicProps;
}
