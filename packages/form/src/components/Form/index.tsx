import FormContext from '@/context/FormContext';
import useForm from '@/hooks/useForm';
import useInitFun from '@/hooks/useInit';
import { FormProps, FormRef } from '@/types/form';
import { InternalFormInstance, Store } from '@hedone/form-core';
import { forwardRef, useCallback, useImperativeHandle, useMemo } from 'react';

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
    },
    [formInstance],
  );

  const wrapperChildren = useMemo(() => {
    return (
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
    );
  }, [formInstance, validateTrigger]);

  return (
    <form {...otherProps} onSubmit={onSubmit} onReset={onReset}>
      {wrapperChildren}
    </form>
  );
};
const WrapperForm = forwardRef(Form) as <T extends Store>(
  props: FormProps<T>,
  ref: React.Ref<FormRef>,
) => ReturnType<typeof Form>;
export default WrapperForm;

// const renderForm = () => {
//   return <Form initialValues={}></Form>;
// };
