import type { NamePath } from '../type';

export const toArray = <T>(value?: T | T[]) => {
	if (value === undefined || value === null) {
		return [];
	}
	return Array.isArray(value) ? value : [value];
};

export const getNamePath = (path?: NamePath) => {
	if (path === undefined) return [];
	return toArray(path);
};

export const isFormInstance = <T>(form?: T) => {
	return form && Object.prototype.hasOwnProperty.call(form, 'getInternalHooks');
};
