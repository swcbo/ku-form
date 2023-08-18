import { FieldProps } from '../../types/field';
import './index.css';

interface LabelViewProps extends Pick<FieldProps, 'label' | 'colon'> {}
const LabelView = ({ label, colon }: LabelViewProps) => {
	return (
		<div className={'form-field-label'}>
			<label className={!colon ? 'form-field-no-colon' : ''}>{label}</label>
		</div>
	);
};
export default LabelView;
