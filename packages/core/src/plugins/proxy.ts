import { InternalNamePath, Store, getNamePath } from '..';

/**  传递一个对象  通过proxy 监听字段的 get set  并返回对应的callback 以及namepath  */
const genProxy = <T extends Store = Store>(
	obj: T,
	callback: (namePath: InternalNamePath[]) => void,
) => {
	return new Proxy<T>(obj, {
		get(target, key, receiver) {
			// console.log('get', target, key, receiver);
			return Reflect.get(target, key, receiver);
		},
		set(target, key, value, receiver) {
			// console.log('set', target, key, value, receiver);
			Reflect.set(target, key, value, receiver);
			const path = [getNamePath(key as string)];
			callback(path);
			return true;
		},
	});
};

export default genProxy;
