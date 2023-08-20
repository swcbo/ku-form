import Form, { FormField } from '@hedone/form';
import { Button, Checkbox, Input } from 'antd';

const BasicCase: React.FC = () => (
	<Form
		name="basic"
		labelCol={{ span: 8 }}
		wrapperCol={{ span: 16 }}
		style={{ maxWidth: 600 }}
		initialValues={{ remember: true }}
		onFinish={console.log}
		onFinishFailed={console.log}
		autoComplete="off">
		<FormField
			label="Username"
			name="username"
			rules={[{ required: true, message: 'Please input your username!' }]}>
			<Input />
		</FormField>

		<FormField
			label="Password"
			name="password"
			rules={[{ required: true, message: 'Please input your password!' }]}>
			<Input.Password />
		</FormField>

		<FormField
			name="remember"
			valuePropName="checked"
			// wrapperCol={{ offset: 8, span: 16 }}
		>
			<Checkbox>Remember me</Checkbox>
		</FormField>

		<FormField
		// wrapperCol={{ offset: 8, span: 16 }}
		>
			<Button type="primary" htmlType="submit">
				Submit
			</Button>
		</FormField>
	</Form>
);

export default BasicCase;
