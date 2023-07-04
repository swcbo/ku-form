import type { NamePath, Store, StoreValue } from '../type';
import { get, set } from 'lodash-es';

export const getValue = (store: Store | undefined, name: NamePath) => {
	return get(store, name);
};
// todo 根据 S 与 NP 的关系，推导出 value 的类型
export const setValue = <const S extends Store, const NP extends NamePath>(
	store: S,
	name: NP,
	value: StoreValue,
) => {
	return set(store, name, value);
};
