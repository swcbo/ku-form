import useForm from '@/hooks/useForm';
import { FormProps } from '@/types/form';
import { FormInstance, Store } from '@hedone/form-core';
import { forwardRef, useImperativeHandle } from 'react';

const Form = forwardRef<FormInstance, FormProps>(
  ({ form, children, ...otherProps }, ref) => {
    const [formInstance] = useForm(form);

    useImperativeHandle(ref, () => formInstance);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {};
    return (
      <form {...otherProps} onSubmit={onSubmit}>
        {children}
      </form>
    );
  },
);
export default Form;
