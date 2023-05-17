import { NamePath, Store } from '../type';
import { get, set } from 'lodash-es';

export const getValue = (store: Store | undefined, name: NamePath) => {
  return get(store, name);
};

export const setValue = (store: Store, name: NamePath, value: any) => {
  return set(store, name, value);
};
