type ISubscribeFunType<T> = (data: T) => void;
class Observer<T> {
  #subs: Map<Symbol, ISubscribeFunType<T>> = new Map();

  dispatch = (state: T) => {
    this.#subs.forEach((fun: ISubscribeFunType<T>) => {
      fun(state);
    });
  };

  subscribe = (fun: ISubscribeFunType<T>) => {
    const id = Symbol('subscribe');
    this.#subs.set(id, fun);
    return () => {
      this.#subs.delete(id);
    };
  };
}

export default Observer;
