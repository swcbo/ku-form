import { createContext, ReactNode } from 'react';
import { RenderFieldProps } from '../../types/field';
import { Store } from '@hedone/form-core';

export type RenderFieldPropsType<T extends Store> = {
	renderPreview?: ((props: RenderFieldProps<T>) => ReactNode) | undefined;
	renderFormItem?: ((props: RenderFieldProps<T>) => ReactNode) | undefined;
};

export type ConfigContextPropsType<T extends Store = Store> = {
	fieldMap: Record<string, RenderFieldPropsType<T>>;
};

const ConfigContext = createContext<ConfigContextPropsType>({
	fieldMap: {},
});

export default ConfigContext;
