import { useEffect, useRef } from 'react';

/* This code acts as a hook that runs a function once the component is initialized. */

const useInitFun = (fun: (init: boolean) => void) => {
  const isInit = useRef(false);
  fun(isInit.current);
  if (!isInit.current) {
    isInit.current = true;
  }
};
export default useInitFun;
