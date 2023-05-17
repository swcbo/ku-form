type ISubscribeFunType<T> = (data: T) => void;
class Observer<T> {
  subs: { [key: string]: ISubscribeFunType<T> | undefined } = {};

  dispatch = (state: T) => {
    Object.keys(this.subs).forEach((key: string) => {
      const fun = this.subs[key];
      fun?.(state);
    });
  };

  subscribe = (fun: ISubscribeFunType<T>) => {
    const id = Object.keys(this.subs).length + 1;
    this.subs[id] = fun;
    return () => {
      this.subs[id] = undefined;
    };
  };
}

export default Observer;
