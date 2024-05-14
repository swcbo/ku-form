import useForceUpdate from '../../hooks/useForceUpdate';
import FieldContext from '../../context/FieldContext';
import FormContext from '../../context/FormContext';
import useRefUpdate from '../../hooks/useRefUpdate';
import {
	EventArgs,
	FieldInstance,
	FieldMate,
	FormFieldProps,
	RenderFieldProps,
} from '../../types/field';
import { getEventDefaultValue } from '../../utils/valueUtils';
import { getNamePath, StoreValue, toArray, getValue, Store } from '@hedone/form-core';
import { cloneElement, isValidElement, memo, useContext, useEffect, useRef } from 'react';
import { containsNamePath } from '../../utils/namePathUtils';
import LabelView from '../FieldLabel';
import './index.css';
import { validateRule } from '../../utils/validateUtils';
import FieldControl from '../FieldControl';
import { isFunction } from '../../utils';
import ConfigContext from '../../context/ConfigContext';
import useDependency from '../../hooks/useDependency';

const FormField = <T extends Store = Store>({
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
	dependency,
	style,
	className = '',
	rules,
	name,
	labelAlign,
	labelCol,
	wrapperCol,
	initialValue,
	...props
}: FormFieldProps<T>) => {
	const { fieldMap } = useContext(ConfigContext);
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
		visible: true,
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
		groupNames: fieldContext.groupNames,
	};
	const fieldInstance = useRefUpdate<FieldInstance>({
		formContext,
		...props,
		...fieldOptions,
		...mate.current.props,
	});
	useDependency(fieldInstance, mate, dependency);

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
				if (!internalName || !fieldInstance.current.editable) return;
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
			groupNames: fieldInstance.current.groupNames || [],
			props: fieldInstance.current,
		});
	}, [fieldInstance, registerField, update, initialValue, name]);

	const WrapperChild = () => {
		const {
			rules,
			normalize,
			internalName,
			editable,
			disabled,
			field = '',
			validateTrigger = formContext.validateTrigger,
			getValueFromEvent,
			fieldProps,
		} = fieldInstance.current;
		const control: RenderFieldProps<T> = {
			...props.fieldProps,
			...fieldProps,
			disabled,
		};
		const renderChildren = field ? fieldMap[field].renderFormItem : children;
		if (internalName) {
			const value = formContext.getFieldValue(internalName);
			control[valuePropName] = value;
			if (!editable) {
				if (renderPreview) {
					return renderPreview(control);
				} else if (fieldMap[field]?.renderPreview) {
					return fieldMap[field]?.renderPreview(control);
				}
			}

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
		if (isFunction(renderChildren)) {
			return renderChildren(control as T);
		} else if (isValidElement(renderChildren)) {
			return cloneElement(renderChildren, control);
		} else {
			return renderChildren;
		}
	};
	const required = fieldInstance.current.rules?.some((v) => v.required);

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
					className={`${required ? 'form-field-required' : ''}
					${className} form-field ${`form-field-${fieldOptions.layout}`}`}
					style={{
						display: mate.current.visible ? 'block' : 'none',
						...style,
					}}>
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
export default memo(FormField) as <T extends Store = Store>(props: FormFieldProps<T>) => JSX.Element;
