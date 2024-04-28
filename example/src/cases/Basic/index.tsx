import Form, { FormField, ConfigContext } from '@hedone/form';
import { Button, Checkbox, Input } from 'antd';

const BasicCase: React.FC = () => (
	<ConfigContext.Provider
		value={{
			fieldMap: {
				input: {
					renderPreview: ({ value }) => {
						return value;
					},
					renderFormItem: (props) => <Input {...props} />,
				},
			},
		}}>
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
				field="input"
				editable={false}
				initialValue={'系哦啊白'}
				rules={[{ required: true, message: 'Please input your username!' }]}
			/>

			<FormField
				label="Password"
				name="password"
				rules={[{ required: true, message: 'Please input your password!' }]}>
				<Input.Password />
			</FormField>

			<FormField
				name="remember"
				valuePropName="checked"
				wrapperCol={{ offset: 8, span: 16 }}>
				<Checkbox>Remember me</Checkbox>
			</FormField>

			<FormField wrapperCol={{ offset: 8, span: 16 }}>
				<Button type="primary" htmlType="submit">
					Submit
				</Button>
			</FormField>
		</Form>
	</ConfigContext.Provider>
);

export default BasicCase;
