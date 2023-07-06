import { InternalNamePath, Store, getNamePath } from '..';

/**  传递一个对象  通过proxy 监听字段的 get set  并返回对应的callback 以及namepath  */
const genProxy = <T extends Store = Store>(
	obj: T,
	callback: (namePath: InternalNamePath[]) => void,
	paths: InternalNamePath = [],
) => {
	const proxyMap = new WeakMap();

	return new Proxy<T>(obj, {
		get(target, key: string, receiver) {
			if (typeof target[key] === 'object' && target[key] !== null) {
				if (!proxyMap.has(target[key])) {
					const path = [...paths, ...getNamePath(key as string)];
					proxyMap.set(target[key], genProxy(target[key], callback, path));
				}
				return proxyMap.get(target[key]);
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
				proxyMap.delete(target[key]);
			}
			return true;
		},
	});
};

export default genProxy;
