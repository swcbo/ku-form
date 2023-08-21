import { InternalNamePath, Store, getNamePath } from '..';

const genProxy = <T extends Store = Store>(
	obj: T,
	callback: (namePath: InternalNamePath[]) => void,
	paths: InternalNamePath = [],
) => {
	const proxyMap = new Map();

	return new Proxy<T>(obj, {
		get(target, key: string, receiver) {
			if (
				typeof target[key] === 'object' &&
				target[key] !== null &&
				key !== 'constructor'
			) {
				const path = [...paths, ...getNamePath(key as string)];
				if (!proxyMap.has(`${path}`)) {
					proxyMap.set(`${path}`, genProxy(target[key], callback, path));
				}
			}
			return Reflect.get(target, key, receiver);
		},
		set(target, key, value, receiver) {
			Reflect.set(target, key, value, receiver);
			const path = [[...paths, ...getNamePath(key as string)]];
			callback(path);
			return true;
		},
		deleteProperty(target, key: string) {
			if (typeof target[key] === 'object' && target[key] !== null) {
				const path = [...paths, ...getNamePath(key as string)];
				proxyMap.delete(`${path}`);
			}
			return true;
		},
	});
};

export default genProxy;
