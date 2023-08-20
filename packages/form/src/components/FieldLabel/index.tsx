import { memo } from 'react';
import useColStyle from '../../hooks/useColStyle';
import { FormFieldProps } from '../../types/field';
import './index.css';

interface FieldLabelProps
	extends Pick<FormFieldProps, 'label' | 'colon' | 'labelAlign' | 'labelCol'> {}
const FieldLabel = ({
	label,
	colon,
	labelAlign: textAlign,
	labelCol = {},
}: FieldLabelProps) => {
	const { span, offset } = labelCol;
	const [style] = useColStyle(span, offset);

	return (
		<div
			className={'form-field-label'}
			style={{
				...style,
				textAlign,
			}}>
			<label className={!colon ? 'form-field-no-colon' : ''}>{label}</label>
		</div>
	);
};
export default memo(FieldLabel);
