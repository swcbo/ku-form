import { NamePath, Store, StoreValue, getValue } from '@hedone/form-core';
import { EventArgs } from '../types/field';

export const getEventDefaultValue = (valuePropName: string, ...args: EventArgs) => {
	const event = args[0];
	if (
		event &&
		event.target &&
		typeof event.target === 'object' &&
		valuePropName in event.target
	) {
		return event.target[valuePropName];
	}

	return event;
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

export const moveField = <T>(array: T[], moveIndex: number, toIndex: number) => {
	const { length } = array;
	if (moveIndex < 0 || moveIndex >= length || toIndex < 0 || toIndex >= length) {
		return array;
	}
	const item = array[moveIndex];
	const diff = moveIndex - toIndex;

	if (diff > 0) {
		// move left
		return [
			...array.slice(0, toIndex),
			item,
			...array.slice(toIndex, moveIndex),
			...array.slice(moveIndex + 1, length),
		];
	}
	if (diff < 0) {
		// move right
		return [
			...array.slice(0, moveIndex),
			...array.slice(moveIndex + 1, toIndex + 1),
			item,
			...array.slice(toIndex + 1, length),
		];
	}
	return array;
};
