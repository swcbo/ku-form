import { memo, useContext } from 'react';
import { FormGroupProps } from '../../types/group';
import FieldContext from '../../context/FieldContext';
import FormField from '../FormField';
import { getNamePath } from '@hedone/form-core';
import FormContext from '../../context/FormContext';
import '../Form/index.css';

const FormGroup = ({
	name,
	style,
	columns,
	children,
	className,
	nameToPreFix,
	...props
}: FormGroupProps) => {
	const formContext = useContext(FormContext);
	const {
		prefixName: names = [],
		groupNames = [],
		layout,
		...reset
	} = useContext(FieldContext);
	const prefixName = [...names, ...(nameToPreFix ? getNamePath(name) : [])];
	const internalLayout = props.layout ?? layout ?? formContext.layout;

	const wrapperChild = (
		<div style={style} className={`form-${layout} ${className}`}>
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
				layout: internalLayout,
				groupNames: [...groupNames, `${name}`],
				prefixName,
			}}>
			{wrapperChild}
		</FieldContext.Provider>
	);
};

export default memo(FormGroup);
