import Form, { FormField, FormGroup, useForm } from '@hedone/form';
import { Button, Input, Space } from 'antd';

const ValidateCase = () => {
	const [form] = useForm();
	return (
		<Form form={form}>
			<FormField
				name="name"
				label="默认"
				rules={[
					{
						required: true,
						message: 'Please input your name!',
					},
				]}>
				<Input placeholder="请输入" />
			</FormField>
			<FormField
				name="blur"
				label="失去焦点校验"
				validateTrigger="onBlur"
				rules={[
					{
						required: true,
						message: 'Please input your name!',
					},
				]}>
				<Input placeholder="请输入" />
			</FormField>
			<FormGroup name="group">
				<FormField
					name="age"
					label="组校验"
					rules={[
						{
							required: true,
							message: 'Please input your name!',
						},
					]}>
					<Input placeholder="请输入" />
				</FormField>
			</FormGroup>
			<FormField>
				<Space>
					<Button type="primary" htmlType="submit">
						校验Form
					</Button>
					<Button
						type="primary"
						onClick={() => {
							form.validateFields({
								groupName: 'group',
							});
						}}>
						校验Group
					</Button>
					<Button
						type="primary"
						onClick={() => {
							form.validateFields({
								nameList: ['name'],
							});
						}}>
						校验Name
					</Button>
				</Space>
			</FormField>
		</Form>
	);
};
export default ValidateCase;
