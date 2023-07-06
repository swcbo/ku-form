import { useContext, useEffect, useRef, useState } from 'react';
import FormContext from '../context/FormContext';
import {
	FormInstance,
	InternalFormInstance,
	NamePath,
	Store,
	StoreValue,
	getNamePath,
	getValue,
} from '@hedone/form-core';
import useRefUpdate from './useRefUpdate';

const useWatch = <T extends Store>(
	dependencies: NamePath,
	options?: {
		form: FormInstance<T>;
		preserve?: boolean;
	},
) => {
	const [value, setValue] = useState<StoreValue>();
	const formContext = useContext(FormContext);
	const form = options?.form || formContext;
	const internalPath = getNamePath(dependencies);
	const namePathRef = useRefUpdate(internalPath);
	const oldValue = useRef(value);
	useEffect(() => {
		const { getInternalHooks, getFieldValue } = form as InternalFormInstance<T>;
		const { registerWatch } = getInternalHooks();
		const cancelWatch = registerWatch(({ values, allValues }) => {
			const current = getValue(
				options?.preserve ? allValues : values,
				namePathRef.current,
			);
			const strValue = typeof current === 'object' ? JSON.stringify(current) : current;
			if (oldValue.current !== strValue) {
				setValue(current);
				oldValue.current = strValue;
			}
		});
		setValue(getFieldValue(namePathRef.current));
		return cancelWatch;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return value;
};
export default useWatch;
