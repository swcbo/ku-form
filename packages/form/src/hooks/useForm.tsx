import Form, { FormInstance, Store } from '@hedone/form-core';
import { useRef } from 'react';
const useForm = <T extends Store = Store>(form?: FormInstance<T>) => {
	const formRef = useRef<FormInstance<T>>(form ?? new Form<T>().getForm());
	return [formRef.current];
};
export default useForm;
