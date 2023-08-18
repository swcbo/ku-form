import { NamePath } from '@hedone/form-core';

/** 判断两个namepath 是否相等 */
export const isSameNamePath = (namePath1: NamePath, namePath2: NamePath) => {
	return `${namePath1}` === `${namePath2}`;
};

/** 判断namepath 是否存在namepath 数组 */
export const containsNamePath = (namePathList: NamePath[], namePath: NamePath) => {
	return namePathList.some((path) => {
		return isSameNamePath(path, namePath);
	});
};
