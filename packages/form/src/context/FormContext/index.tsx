import { FormContextStore } from '@/types/form';
import { createContext } from 'react';
const warningFunc = () => {
  console.warn('Can not find FormContext');
};
const FormContext = createContext<FormContextStore>({
  registerField: warningFunc,
  setInitialValues: warningFunc,
  setPreserve: warningFunc,
  getInitialValue: warningFunc,
  setCallbacks: warningFunc,
  dispatch: warningFunc,
  getInternalHooks: () => {
    warningFunc();
    return {
      registerField: warningFunc,
      setInitialValues: warningFunc,
      setPreserve: warningFunc,
      getInitialValue: warningFunc,
      setCallbacks: warningFunc,
      dispatch: warningFunc,
    };
  },
} as unknown as FormContextStore);
export default FormContext;
