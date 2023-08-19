import { FieldInstance } from '../../types/field';
import { createContext } from 'react';
const FieldContext = createContext<FieldInstance>({});
export default FieldContext;
