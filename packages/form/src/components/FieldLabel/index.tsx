import { memo } from 'react';
import { FieldProps } from '../../types/field';
import './index.css';

interface FieldLabelProps extends Pick<FieldProps, 'label' | 'colon' | 'labelAlign'> {}
const FieldLabel = ({ label, colon, labelAlign: textAlign }: FieldLabelProps) => {
	return (
		<div className={'form-field-label'}>
			<label
				className={!colon ? 'form-field-no-colon' : ''}
				style={{
					textAlign,
				}}>
				{label}
			</label>
		</div>
	);
};
export default memo(FieldLabel);
