import { FieldInstance } from '../../types/field';
import { createContext } from 'react';
const FieldContext = createContext<Partial<FieldInstance>>({});
export default FieldContext;
