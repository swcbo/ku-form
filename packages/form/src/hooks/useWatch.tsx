import { useContext, useEffect, useState } from 'react';
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
	const oldValue = useRefUpdate(value);

	useEffect(() => {
		const { getInternalHooks, getFieldValue, getFieldsValue } =
			form as InternalFormInstance<T>;
		const { registerWatch } = getInternalHooks();
		const cancelWatch = registerWatch(() => {
			const currentValue = getValue(
				getFieldsValue({
					getStoreAll: options?.preserve,
				}),
				namePathRef.current,
			);
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
