import { FieldInstance } from '@/types/field';
import { createContext } from 'react';
const FieldContext = createContext<FieldInstance>({
  props: {},
});
export default FieldContext;
