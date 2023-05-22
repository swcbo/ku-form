import { InternalFormInstance } from '@hedone/form-core';
import { createContext } from 'react';
const warningFunc = () => {
  console.warn('Can not find FormContext');
};
const FormContext = createContext<InternalFormInstance>({
  registerField: warningFunc,
  setInitialValues: warningFunc,
  setPreserve: warningFunc,
  getInitialValue: warningFunc,
  registerGroup: warningFunc,
  setCallbacks: warningFunc,
  dispatch: warningFunc,
  getInternalHooks: () => {
    warningFunc();
    return {
      registerField: warningFunc,
      setInitialValues: warningFunc,
      setPreserve: warningFunc,
      getInitialValue: warningFunc,
      registerGroup: warningFunc,
      setCallbacks: warningFunc,
      dispatch: warningFunc,
    };
  },
} as unknown as InternalFormInstance);
export default FormContext;
