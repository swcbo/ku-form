import { FieldProps } from '../../types/field';
import './index.css';

interface LabelViewProps extends Pick<FieldProps, 'label' | 'colon' | 'labelAlign'> {}
const LabelView = ({ label, colon, labelAlign: textAlign }: LabelViewProps) => {
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
export default LabelView;
