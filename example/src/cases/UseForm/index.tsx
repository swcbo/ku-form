import Form, { FormField, useForm } from '@hedone/form';
import { Button, Input, Space } from 'antd';

const UseFormCase = () => {
	const [form] = useForm();
	return (
		<>
			<Form form={form}>
				<FormField name="name" label="名称" initialValue="小白">
					<Input placeholder="请输入" />
				</FormField>
				<FormField name="name" label="名称" initialValue="小白1">
					<Input placeholder="请输入" />
				</FormField>
				<FormField name="age" label="年龄">
					<Input placeholder="请输入" />
				</FormField>
			</Form>
			<Space>
				<Button
					type="primary"
					onClick={() => {
						console.log(form.getFieldsValue());
					}}>
					点击获取数据
				</Button>
				<Button
					type="primary"
					onClick={() => {
						form.setFieldValue('name', '张三');
					}}>
					点击切换数据
				</Button>
				<Button
					onClick={() => {
						form.resetFields();
					}}>
					清空数据
				</Button>
				<Button
					onClick={() => {
						console.log(
							form.isFieldsTouched({
								nameList: ['name'],
							}),
						);
					}}>
					查看是否修改
				</Button>
			</Space>
		</>
	);
};
export default UseFormCase;
