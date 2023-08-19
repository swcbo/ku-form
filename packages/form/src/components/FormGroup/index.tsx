import { memo, useContext } from 'react';
import { FormGroupProps } from '../../types/group';
import FieldContext from '../../context/FieldContext';
import FormField from '../FormField';
import { getNamePath } from '@hedone/form-core';

const FormGroup = ({
	name,
	style,
	columns,
	children,
	className,
	nameToPreFix,
	...props
}: FormGroupProps) => {
	const { prefixName: names = [], groupNames = [], ...reset } = useContext(FieldContext);
	const prefixName = [...names, ...(nameToPreFix ? getNamePath(name) : [])];

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
				...reset,
				...props,
				groupNames: [...groupNames, `${name}`],
				prefixName,
			}}>
			{wrapperChild}
		</FieldContext.Provider>
	);
};

export default memo(FormGroup);
