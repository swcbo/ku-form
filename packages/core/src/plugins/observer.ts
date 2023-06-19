import type { Store, ValueChangeParams } from '../type';

export type ISubscribeFunType<T> = (data: T) => void;
type ObserverInnerValue<T extends Store> = ValueChangeParams<T>;
class Observer<T extends Store> {
	#subs: Map<symbol, ISubscribeFunType<ObserverInnerValue<T>>> = new Map();

	dispatch = (state: ObserverInnerValue<T>) => {
		this.#subs.forEach((fun) => {
			fun(state);
		});
	};

	subscribe = (fun: ISubscribeFunType<ObserverInnerValue<T>>) => {
		const id = Symbol('subscribe');
		this.#subs.set(id, fun);
		return () => {
			this.#subs.delete(id);
		};
	};
}

export default Observer;
