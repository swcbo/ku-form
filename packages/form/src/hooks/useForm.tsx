import FormStore, { FormInstance, Store } from '@hedone/form-core';
import { useRef } from 'react';
const useForm = <T extends Store = Store>(form?: FormInstance<T>) => {
  const formRef = useRef<FormInstance>(form ?? new FormStore().getForm());
  return [formRef.current];
};
export default useForm;
