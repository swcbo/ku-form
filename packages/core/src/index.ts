import Form from './form';
export { getValue, setValue } from './utils/valueUtils';
export { getNamePath, toArray } from './utils/typeUtils';
export type {
	Store,
	NamePath,
	Callbacks,
	StoreValue,
	FormInstance,
	InternalNamePath,
	InternalFormInstance,
	FormInternalField,
	FieldInjectProps,
	InternalHooks,
} from './type';

export default Form;
