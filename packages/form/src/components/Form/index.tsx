import FormContext from '../../context/FormContext';
import useForm from '../../hooks/useForm';
import useInitFun from '../../hooks/useInit';
import { FormContextStore, FormProps, FormRef } from '../../types/form';
import { InternalFormInstance, Store } from '@hedone/form-core';
import { forwardRef, memo, useCallback, useImperativeHandle } from 'react';
import './index.css';

const Form = <T extends Store = Store>(
	{
		form,
		colon = true,
		preserve = true,
		editable = true,
		disabled = false,
		initialValues,
		validateTrigger = 'onChange',
		layout = 'horizontal',
		className,
		...reset
	}: FormProps<T>,
	ref: React.Ref<FormRef<T>>,
) => {
	const [formInstance] = useForm<T>(form);
	const {
		labelCol,
		wrapperCol,
		labelAlign,
		onFinish,
		onFinishFailed,
		onValuesChange,
		children,
		...formProps
	} = reset;
	const internalFormInstance = formInstance as unknown as InternalFormInstance<T>;
	const { setCallbacks, setPreserve, setInitialValues } =
		internalFormInstance.getInternalHooks();
	setCallbacks({
		onValuesChange,
		onFinish,
		onFinishFailed,
	});
	setPreserve(preserve);
	useInitFun((init) => {
		setInitialValues(initialValues as T, init);
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
			reset.onReset?.(e);
		},
		[formInstance, reset],
	);

	return (
		<form
			{...formProps}
			className={`form-${layout} ${className}`}
			onSubmit={onSubmit}
			onReset={onReset}>
			<FormContext.Provider
				value={
					{
						...internalFormInstance,
						...reset,
						layout,
						colon,
						editable,
						disabled,
						preserve,
						labelCol,
						labelAlign,
						wrapperCol,
						validateTrigger,
					} as FormContextStore
				}>
				{children}
			</FormContext.Provider>
		</form>
	);
};
const WrapperForm = forwardRef(Form) as <T extends Store>(
	props: FormProps<T> & { ref?: React.Ref<FormRef<T>> },
) => React.ReactElement;
export default memo(WrapperForm);
