import Form, { FormGroup } from '@hedone/form';
import { Input } from 'antd';

const GroupCase = () => {
	return (
		<Form>
			分组1:
			<FormGroup
				name="group"
				columns={[
					{
						name: 'name',
						label: '名称',
						children: <Input placeholder="请输入" />,
					},
				]}
			/>
		</Form>
	);
};

export default GroupCase;
