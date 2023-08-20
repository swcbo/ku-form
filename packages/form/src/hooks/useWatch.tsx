import {
	FormInstance,
	InternalFormInstance,
	NamePath,
	Store,
	StoreValue,
	getNamePath,
	isFormInstance,
} from '@hedone/form-core';
import { useContext, useEffect, useRef, useState } from 'react';
import FormContext from '../context/FormContext';
import { getValueAndStringify } from '../utils/valueUtils';
import useRefUpdate from './useRefUpdate';
type WatchOption<T extends Store> = {
	form?: FormInstance<T>;
	preserve?: boolean;
};

const useWatch = <T extends Store>(
	dependencies: NamePath,
	options?: WatchOption<T> | FormInstance<T>,
) => {
	const [value, setValue] = useState<StoreValue>();
	const formContext = useContext(FormContext);
	const _options = isFormInstance(options)
		? { form: options, preserve: false }
		: { ...options, form: (options as WatchOption<T>)?.form || formContext };
	const internalPath = getNamePath(dependencies);
	const internalRef = useRefUpdate({
		internalPath,
		options: _options,
	});
	const oldValue = useRef(value);
	useEffect(() => {
		const { options, internalPath } = internalRef.current;
		const { form, preserve } = options;
		const { getInternalHooks, getFieldsValue } = form as InternalFormInstance<T>;
		const { registerWatch } = getInternalHooks();

		const cancelWatch = registerWatch(({ values, allValues, namePathList }) => {
			if (
				namePathList.length &&
				!namePathList.join(',').startsWith(`${internalPath.join(',')}`)
			)
				return;
			const { value, strValue } = getValueAndStringify(
				preserve ? allValues : values,
				internalPath,
			);
			if (oldValue.current !== strValue) {
				setValue(value);
				oldValue.current = strValue;
			}
		});
		const { value, strValue } = getValueAndStringify(
			getFieldsValue({
				getStoreAll: preserve,
			}),
			internalPath,
		);
		oldValue.current = strValue;
		setValue(value);
		return cancelWatch;
	}, [internalRef]);
	return value;
};
export default useWatch;
