import FormContext from '@/context/FormContext';
import useForm from '@/hooks/useForm';
import useInitFun from '@/hooks/useInit';
import { FormProps } from '@/types/form';
import { FormInstance, InternalFormInstance } from '@hedone/form-core';
import { forwardRef, useCallback, useImperativeHandle, useMemo } from 'react';

const Form = forwardRef<FormInstance, FormProps>(
  (
    {
      form,
      colon,
      children,
      preserve,
      editable,
      disabled,
      initialValues,
      onFinish,
      onFinishFailed,
      onValuesChange,
      ...otherProps
    },
    ref,
  ) => {
    const [formInstance] = useForm(form);
    const internalFormInstance = formInstance as unknown as InternalFormInstance;
    const { setCallbacks, setPreserve, setInitialValues } =
      internalFormInstance.getInternalHooks();
    setCallbacks({
      onValuesChange,
      onFinish,
      onFinishFailed,
    });
    setPreserve(preserve);
    useInitFun((init) => {
      setInitialValues(initialValues, init);
    });
    useImperativeHandle(ref, () => formInstance);

    const onSubmit = useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        formInstance.submit();
      },
      [formInstance],
    );

    const onReset = useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        formInstance.resetFields();
        otherProps.onReset?.(e);
      },
      [formInstance],
    );

    const WrapperForm = useMemo(() => {
      return (
        <FormContext.Provider
          value={{
            ...internalFormInstance,
          }}>
          {children}
        </FormContext.Provider>
      );
    }, [formInstance]);
    return (
      <form {...otherProps} onSubmit={onSubmit} onReset={onReset}>
        {WrapperForm}
      </form>
    );
  },
);
export default Form;
