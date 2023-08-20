import { ReactNode, memo } from 'react';
import './index.css';
import { FormFieldProps } from '../../types/field';
import useColStyle from '../../hooks/useColStyle';
interface FieldControlProps extends Pick<FormFieldProps, 'wrapperCol'> {
	children: ReactNode;
	errors: string[];
}

const FieldControl = ({ children, errors, wrapperCol = {} }: FieldControlProps) => {
	const { span, offset } = wrapperCol;
	const [style] = useColStyle(span, offset);
	return (
		<div className={'form-field-control'} style={style}>
			{children}
			<div className="form-item-explain">
				{errors.map((error) => (
					<div key={error} className="form-field-explain-error">
						{error}
					</div>
				))}
			</div>
		</div>
	);
};
export default memo(FieldControl);
