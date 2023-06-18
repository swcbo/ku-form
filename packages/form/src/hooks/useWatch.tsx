import { useContext, useEffect, useState } from 'react';
import FormContext from '../context/FormContext';
import {
	FormInstance,
	InternalFormInstance,
	NamePath,
	StoreValue,
	getNamePath,
} from '@hedone/form-core';
import useRefUpdate from './useRefUpdate';

const useWatch = (
	dependencies: NamePath,
	options?: {
		form: FormInstance;
	},
) => {
	const [value, setValue] = useState<StoreValue>();
	const formContext = useContext(FormContext);
	const form = options?.form || formContext;

	const internalPath = getNamePath(dependencies);
	const namePathRef = useRefUpdate(internalPath);
	const oldValue = useRefUpdate(value);

	useEffect(() => {
		const { getInternalHooks, getFieldValue } = form as InternalFormInstance;
		const { registerWatch } = getInternalHooks();
		const cancelWatch = registerWatch(() => {
			const currentValue = getFieldValue(namePathRef.current);
			if (oldValue.current !== currentValue) {
				setValue(currentValue);
			}
		});
		setValue(getFieldValue(namePathRef.current));
		return cancelWatch;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return value;
};
export default useWatch;
