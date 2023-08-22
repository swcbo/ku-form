import Form, { FormField, FormGroup } from '@hedone/form';
import { Button, Input } from 'antd';

const GroupCase = () => {
	return (
		<Form onFinish={console.log}>
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
			<FormGroup name="group1" nameToPreFix>
				<FormField name="age" label="年龄">
					<Input placeholder="请输入" />
				</FormField>
			</FormGroup>
			<Button type="primary" htmlType="submit">
				获取值
			</Button>
		</Form>
	);
};

export default GroupCase;
