import Form, { ConfigContext, FormField } from '@hedone/form';
import { Button, Input } from 'antd';

const RegisterCase: React.FC = () => {
	return (
		<ConfigContext.Provider
			value={{
				fieldMap: {
					input: {
						renderPreview: ({ value = '--' }) => {
							return (
								<div
									style={{
										lineHeight: '32px',
									}}>
									{value}
								</div>
							);
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
					required
					initialValue={'系哦啊白'}
					rules={[{ required: true, message: 'Please input your username!' }]}
				/>

				<FormField wrapperCol={{ offset: 8, span: 16 }}>
					<Button type="primary" htmlType="submit">
						Submit
					</Button>
				</FormField>
			</Form>
		</ConfigContext.Provider>
	);
};

export default RegisterCase;
