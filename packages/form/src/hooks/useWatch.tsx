import {
	FormInstance,
	InternalFormInstance,
	NamePath,
	Store,
	StoreValue,
	getNamePath,
} from '@hedone/form-core';
import { useContext, useEffect, useRef, useState } from 'react';
import FormContext from '../context/FormContext';
import { getValueAndStringify } from '../utils/valueUtils';
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
		const { getInternalHooks, getFieldsValue } = form as InternalFormInstance<T>;
		const { registerWatch } = getInternalHooks();

		const cancelWatch = registerWatch(({ values, allValues, namePathList }) => {
			if (
				namePathList.length &&
				!namePathList.join(',').startsWith(`${namePathRef.current.join(',')}`)
			)
				return;
			const { value, strValue } = getValueAndStringify(
				options?.preserve ? allValues : values,
				namePathRef.current,
			);
			if (oldValue.current !== strValue) {
				setValue(value);
				oldValue.current = strValue;
			}
		});
		const { value, strValue } = getValueAndStringify(
			getFieldsValue({
				getStoreAll: options?.preserve,
			}),
			namePathRef.current,
		);
		oldValue.current = strValue;
		setValue(value);
		return cancelWatch;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return value;
};
export default useWatch;
