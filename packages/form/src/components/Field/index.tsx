import useForceUpdate from '../../hooks/useForceUpdate';
import FieldContext from '../../context/FieldContext';
import FormContext from '../../context/FormContext';
import useRefUpdate from '../../hooks/useRefUpdate';
import { EventArgs, FieldMate, FieldProps } from '../../types/field';
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
import LabelView from '../LabelView';
import './index.css';
import { validateRule } from '../../utils/validateUtils';
import FieldControl from '../FieldControl';
import { isFunction } from '../../utils';

const Field = ({
	children,
	fieldType,
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
	...props
}: FieldProps) => {
	const formContext = useContext(FormContext);
	const scopeContext = useContext(FieldContext);
	const [update] = useForceUpdate();
	const { dispatch, registerField } = formContext.getInternalHooks();
	const internalName = props.name
		? [...getNamePath(scopeContext.prefixName), ...getNamePath(props.name)]
		: [];
	const fieldOptions = {
		internalName,
		disabled: disabled ?? scopeContext.props.disabled ?? formContext.disabled ?? false,
		colon: props.colon ?? formContext.colon ?? scopeContext.props.colon ?? true,
		editable: editable ?? scopeContext.props.editable ?? formContext.editable ?? true,
		preserve: preserve ?? scopeContext.props.preserve ?? formContext.preserve ?? true,
		validateTrigger:
			validateTrigger ??
			scopeContext.props.validateTrigger ??
			formContext.validateTrigger ??
			'onChange',
	};
	const fieldInstance = useRefUpdate({
		...props,
		...fieldOptions,
	});
	const mate = useRef<FieldMate>({
		touched: false,
		errors: [],
	});

	const finalContext = Object.assign({}, scopeContext);
	if (fieldType === 'scope') {
		finalContext.prefixName = fieldInstance.current.internalName;
		finalContext.props = fieldOptions;
	}

	useEffect(() => {
		return registerField({
			isFieldTouched: () => mate.current.touched,
			getNamePath: () => fieldInstance.current.internalName,
			isPreserve: () => fieldInstance.current.preserve,
			validate: async (options) => {
				const { rules, internalName } = fieldInstance.current;
				const validate =
					rules &&
					(await validateRule(
						formContext.getFieldValue(internalName),
						fieldInstance.current,
					));

				if (!options?.validateOnly) {
					mate.current.errors = validate?.errors || [];
					update();
				}
				return validate;
			},
			onStoreChange: (action) => {
				const { info, namePathList, prevStore } = action;
				const { internalName, onReset } = fieldInstance.current;
				const prevValue = getValue(prevStore, internalName);
				const curValue = formContext.getFieldValue(internalName);
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
						if (info.source === 'external' && prevValue !== curValue) {
							mate.current.errors = [];
						}
						if ((!namePathList || namePathMatch) && valueChange) {
							mate.current.touched = true;
							update();
						}
						break;
					case 'dependenciesUpdate':
						break;
					case 'validate':
						break;
					case 'reset':
						if ((!namePathList || namePathMatch) && valueChange) {
							mate.current.touched = false;
							update();
							onReset?.();
						}
						break;
				}
			},
			props: fieldInstance.current,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
		const value = formContext.getFieldValue(internalName);
		if (!editable && renderPreview) {
			return renderPreview(value);
		}
		const control: FieldInjectProps = {
			...props,
			disabled,
			[valuePropName]: value,
		};
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
		if (isFunction(children)) {
			return children(control, formContext);
		} else if (isValidElement(children)) {
			return cloneElement(children, control);
		} else {
			console.warn('children must be function or ReactElement');
			return children;
		}
	};
	return (
		<FieldContext.Provider
			value={{
				...scopeContext,
			}}>
			{noStyle ? (
				WrapperChild()
			) : (
				<div className={`form-field ${className}`} style={style}>
					{label && <LabelView label={label} colon={fieldOptions.colon} />}
					<FieldControl errors={mate.current.errors}>{WrapperChild()}</FieldControl>
				</div>
			)}
		</FieldContext.Provider>
	);
};
export default memo(Field);
