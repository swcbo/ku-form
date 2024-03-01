import useForceUpdate from '../../hooks/useForceUpdate';
import FieldContext from '../../context/FieldContext';
import FormContext from '../../context/FormContext';
import useRefUpdate from '../../hooks/useRefUpdate';
import { EventArgs, FieldMate, FormFieldProps } from '../../types/field';
import { getEventDefaultValue } from '../../utils/valueUtils';
import {
	FieldInjectProps,
	getNamePath,
	StoreValue,
	toArray,
	getValue,
} from '@hedone/form-core';
import { cloneElement, isValidElement, memo, useContext, useEffect, useRef } from 'react';
import { containsNamePath } from '../../utils/namePathUtils';
import LabelView from '../FieldLabel';
import './index.css';
import { validateRule } from '../../utils/validateUtils';
import FieldControl from '../FieldControl';
import { isFunction } from '../../utils';

const FormField = ({
	children,
	preserve,
	disabled,
	editable,
	label,
	noStyle,
	validateTrigger,
	trigger = 'onChange',
	valuePropName = 'value',
	renderPreview,
	style,
	className = '',
	rules,
	name,
	labelAlign,
	labelCol,
	wrapperCol,
	initialValue,
	...props
}: FormFieldProps) => {
	const formContext = useContext(FormContext);
	const fieldContext = useContext(FieldContext);
	const [update] = useForceUpdate();
	const { dispatch, registerField } = formContext.getInternalHooks();
	const internalName = name
		? [...getNamePath(fieldContext.prefixName), ...getNamePath(name)]
		: undefined;
	const mate = useRef<FieldMate>({
		touched: false,
		errors: [],
	});
	const fieldOptions = {
		name,
		rules,
		internalName,
		labelCol: labelCol ?? fieldContext.labelCol ?? formContext.labelCol,
		wrapperCol: wrapperCol ?? fieldContext.wrapperCol ?? formContext.wrapperCol,
		disabled: disabled ?? fieldContext.disabled ?? formContext.disabled ?? false,
		colon: props.colon ?? fieldContext.colon ?? formContext.colon ?? true,
		editable: editable ?? fieldContext.editable ?? formContext.editable ?? true,
		preserve: preserve ?? fieldContext.preserve ?? formContext.preserve ?? true,
		layout: fieldContext.layout ?? formContext.layout,
		labelAlign:
			labelAlign ?? fieldContext.labelAlign ?? formContext.labelAlign ?? 'right',
		validateTrigger:
			validateTrigger ??
			fieldContext.validateTrigger ??
			formContext.validateTrigger ??
			'onChange',
		mate: mate.current,
		initialValue,
	};
	const fieldInstance = useRefUpdate({
		formContext,
		fieldContext,
		...props,
		...fieldOptions,
	});

	useEffect(() => {
		return registerField({
			isFieldTouched: () => mate.current.touched,
			getNamePath: () => fieldInstance.current.internalName,
			isPreserve: () => fieldInstance.current.preserve,
			validate: async (options) => {
				const {
					rules,
					internalName,
					formContext: { getFieldValue },
				} = fieldInstance.current;
				if (!internalName) return;
				const validate =
					rules && (await validateRule(getFieldValue(internalName), rules, internalName));

				if (!options?.validateOnly) {
					mate.current.errors = validate?.errors || [];
					update();
				}
				return validate;
			},
			onStoreChange: (action) => {
				const { info, namePathList, prevStore } = action;
				const {
					internalName,
					onReset,
					formContext: { getFieldValue },
				} = fieldInstance.current;
				if (!internalName) {
					return;
				}
				const prevValue = getValue(prevStore, internalName);
				const curValue = getFieldValue(internalName);
				const namePathMatch =
					namePathList && containsNamePath(namePathList, internalName);
				const valueChange = prevValue !== curValue;
				switch (info.type) {
					case 'clearValidate':
						if (mate.current.errors.length) {
							mate.current.errors = [];
							update();
						}
						break;
					case 'valueUpdate':
						if (info.source === 'register') {
							update();
							return;
						}
						if ((!namePathList || namePathMatch) && valueChange) {
							if (info.source === 'external') {
								mate.current.errors = [];
							}
							mate.current.touched = true;
							update();
						}
						break;
					case 'dependenciesUpdate':
						break;
					case 'reset':
						if ((!namePathList || namePathMatch) && valueChange) {
							mate.current.errors = [];
							mate.current.touched = false;
							update();
							onReset?.();
						}
						break;
				}
			},
			groupNames: fieldInstance.current.fieldContext.groupNames || [],
			props: fieldInstance.current,
		});
	}, [fieldInstance, registerField, update]);

	const WrapperChild = () => {
		const {
			rules,
			normalize,
			internalName,
			editable,
			disabled,
			validateTrigger = formContext.validateTrigger,
			getValueFromEvent,
		} = fieldInstance.current;
		const control: FieldInjectProps = {
			...props,
			disabled,
		};
		if (internalName) {
			const value = formContext.getFieldValue(internalName);
			if (!editable && renderPreview) {
				return renderPreview(value);
			}
			control[valuePropName] = value;
			/** proxy trigger */
			const originTrigger = control[trigger] as (...args: EventArgs) => void;
			control[trigger] = (...args: EventArgs) => {
				let currentValue: StoreValue;

				if (getValueFromEvent) {
					currentValue = getValueFromEvent(...args);
				} else {
					currentValue = getEventDefaultValue(valuePropName, ...args);
				}
				normalize?.(currentValue, value, formContext.getFieldsValue());
				dispatch({
					type: 'updateValue',
					namePath: internalName,
					value: currentValue,
					source: 'trigger',
				});
				originTrigger?.(...args);
			};
			/** proxy validate */
			const validateTriggerList: string[] = toArray(validateTrigger) || [];
			validateTriggerList.forEach((triggerName) => {
				const originTrigger = control[triggerName] as (...args: EventArgs) => void;
				control[triggerName] = (...args: EventArgs) => {
					originTrigger?.(...args);
					if (rules && rules.length) {
						dispatch({
							type: 'validateField',
							namePath: internalName,
							triggerName,
						});
					}
				};
			});
		}
		if (isFunction(children)) {
			return children(control, formContext);
		} else if (isValidElement(children)) {
			return cloneElement(children, control);
		} else {
			return children;
		}
	};
	const required = rules?.some((v) => v.required);

	return (
		<FieldContext.Provider
			value={{
				...fieldContext,
				...fieldOptions,
			}}>
			{noStyle ? (
				<FieldControl errors={mate.current.errors}>{WrapperChild()}</FieldControl>
			) : (
				<div
					className={`form-field ${`form-field-${fieldOptions.layout}`}  ${
						required ? 'form-field-required' : ''
					} ${className} `}
					style={style}>
					{label && (
						<LabelView
							label={label}
							labelCol={fieldOptions.labelCol}
							colon={fieldOptions.layout !== 'vertical' && fieldOptions.colon}
							labelAlign={fieldOptions.labelAlign}
						/>
					)}
					<FieldControl errors={mate.current.errors} wrapperCol={fieldOptions.wrapperCol}>
						{WrapperChild()}
					</FieldControl>
				</div>
			)}
		</FieldContext.Provider>
	);
};
export default memo(FormField);
