import { createContext, ReactNode } from 'react';
import { RenderFieldProps } from '../../types/field';

export type RenderFieldPropsType = {
	renderPreview?: ((props: RenderFieldProps) => ReactNode) | undefined;
	renderFormItem?: ((props: RenderFieldProps) => ReactNode) | undefined;
};

export type ConfigContextPropsType = {
	fieldMap: Record<string, RenderFieldPropsType>;
};

const ConfigContext = createContext<ConfigContextPropsType>({
	fieldMap: {},
});

export default ConfigContext;
