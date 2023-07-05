import { InternalNamePath, Store, getNamePath } from '..';

/**  传递一个对象  通过proxy 监听字段的 get set  并返回对应的callback 以及namepath  */
const genProxy = <T extends Store = Store>(
	obj: T,
	callback: (namePath: InternalNamePath[]) => void,
	paths: InternalNamePath[] = [],
) => {
	const deps = new Set<string>();
	return new Proxy<T>(obj, {
		get(target, key: string, receiver) {
			//  对象或数组的话递归代理
			const path = [...paths, getNamePath(key as string)];
			if (
				typeof target[key] === 'object' &&
				target[key] !== null &&
				!deps.has(path.join('.'))
			) {
				deps.add(path.join('.'));
				genProxy(target[key], callback, path);
			}
			console.log('get', target, key);
			return Reflect.get(target, key, receiver);
		},
		set(target, key, value, receiver) {
			console.log('set', key, value);
			Reflect.set(target, key, value, receiver);
			const path = [...paths, getNamePath(key as string)];
			callback(path);
			return true;
		},
		deleteProperty(target, key) {
			Reflect.deleteProperty(target, key);
			const path = [...paths, getNamePath(key as string)];
			deps.delete(path.join('.'));
			callback(path);
			return true;
		},
	});
};

export default genProxy;
