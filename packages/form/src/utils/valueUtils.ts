import { NamePath, Store, StoreValue, getValue } from '@hedone/form-core';
import { EventArgs } from '../types/field';

export const getEventDefaultValue = (valuePropName: string, ...args: EventArgs) => {
	const target = args[0]?.target;
	if (target && typeof target === 'object' && valuePropName in target) {
		return target[valuePropName];
	}
	return target;
};

export const stringify = (value: StoreValue) => {
	return typeof value === 'object' ? JSON.stringify(value) : value;
};

export const getValueAndStringify = (store: Store, name: NamePath) => {
	const value = getValue(store, name);
	const strValue = stringify(value);
	return {
		value,
		strValue,
	};
};
