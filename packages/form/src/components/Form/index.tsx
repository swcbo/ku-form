import FormContext from '../../context/FormContext';
import useForm from '../../hooks/useForm';
import useInitFun from '../../hooks/useInit';
import { FormProps, FormRef } from '../../types/form';
import { InternalFormInstance, Store } from '@hedone/form-core';
import { forwardRef, memo, useCallback, useImperativeHandle } from 'react';

export const Form = <T extends Store = Store>(
  {
    form,
    colon = true,
    children,
    preserve = true,
    editable = true,
    disabled = false,
    initialValues,
    validateTrigger = 'onChange',
    onFinish,
    onFinishFailed,
    onValuesChange,
    ...otherProps
  }: FormProps<T>,
  ref: React.Ref<FormRef>,
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
  return (
    <form {...otherProps} onSubmit={onSubmit} onReset={onReset}>
      <FormContext.Provider
        value={{
          ...internalFormInstance,
          colon,
          editable,
          disabled,
          preserve,
          validateTrigger,
        }}>
        {children}
      </FormContext.Provider>
    </form>
  );
};
const WrapperForm = forwardRef(Form) as <T extends Store>(
  props: FormProps<T> & { ref?: React.Ref<FormRef> },
) => React.ReactElement;
export default memo(WrapperForm);
