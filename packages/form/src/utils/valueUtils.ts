import { EventArgs } from '../types/field';

export const getEventDefaultValue = (valuePropName: string, ...args: EventArgs) => {
	const target = args[0]?.target;
	if (target && typeof target === 'object' && valuePropName in target) {
		return target[valuePropName];
	}
	return target;
};
