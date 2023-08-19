import { memo, useContext, useRef } from 'react';
import { FormGroupProps } from '../../types/group';
import FieldContext from '../../context/FieldContext';
import FormField from '../FormField';
import { InternalNamePath, getNamePath } from '@hedone/form-core';

const FormGroup = ({
	name,
	style,
	columns,
	children,
	className,
	nameToPreFix,
	...props
}: FormGroupProps) => {
	const fieldContext = useContext(FieldContext);
	const internalName = useRef<InternalNamePath>();
	internalName.current = name
		? [...getNamePath(fieldContext.name), ...(nameToPreFix ? getNamePath(name) : [])]
		: undefined;

	const wrapperChild = (
		<div
			{...{
				style,
				className,
			}}>
			{columns?.map((v, index) => (
				<FormField {...v} key={`field_${v.name}_${index}`} />
			))}
			{children}
		</div>
	);
	return (
		<FieldContext.Provider
			value={{
				...fieldContext,
				...props,
				name: internalName.current,
			}}>
			{wrapperChild}
		</FieldContext.Provider>
	);
};

export default memo(FormGroup);
