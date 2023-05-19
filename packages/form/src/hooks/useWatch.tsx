import { FormInstance, NamePath } from '@hedone/form-core/typings/type';
import { useContext, useState } from 'react';
import FormContext from '../context/FormContext';

const useWatch = (
  dependency: NamePath,
  options?: {
    form: FormInstance;
  },
) => {
  const [value, setValue] = useState();
  const formContext = useContext(FormContext);
  const from = options?.form || formContext;
};
export default useWatch;
