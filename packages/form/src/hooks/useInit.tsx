import { useRef } from 'react';
const useInitFun = (fun: (init: boolean) => void) => {
  const isInit = useRef(true);
  fun(isInit.current);
  if (isInit.current) {
    isInit.current = false;
  }
};
export default useInitFun;
