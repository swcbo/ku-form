import { getValue, setValue } from './utils/valueUtils';
import { getNamePath, toArray } from './utils/typeUtils';
import {
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
import Form from './form';
export { getNamePath, toArray, getValue, setValue };

export type {
  Store,
  NamePath,
  Callbacks,
  StoreValue,
  FormInstance,
  InternalHooks,
  InternalNamePath,
  FieldInjectProps,
  FormInternalField,
  InternalFormInstance,
};
export default Form;
