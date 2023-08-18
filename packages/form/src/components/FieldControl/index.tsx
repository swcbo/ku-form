import { ReactNode, memo } from 'react';
import './index.css';
interface FieldControlProps {
	children: ReactNode;
	errors: string[];
}

const FieldControl = ({ children, errors }: FieldControlProps) => {
	return (
		<div className={'form-field-control'}>
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
