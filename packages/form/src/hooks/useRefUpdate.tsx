import { Store } from '@hedone/form-core';
import { useRef } from 'react';
const useRefUpdate = <T extends Store>(value: T) => {
	const ref = useRef<T>(value);
	ref.current = value;
	return ref;
};
export default useRefUpdate;
