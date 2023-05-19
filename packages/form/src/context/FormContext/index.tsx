import { InternalFormInstance } from '@hedone/form-core/typings/type';
import { createContext } from 'react';

const FormContext = createContext<InternalFormInstance>({});

export default FormContext;
