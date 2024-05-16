import Form, { FormField, useForm } from '@hedone/form';
import { Button, Input, Select } from 'antd';
type FormStore = {
	type: string,
	name: string,
	data: {
		name: string,
		a: {
			b: number
		}
	}
}
const DependencyCase = () => {
	const [form] = useForm<FormStore>();
	const onBtn = () => {
		const name = form.getFieldValue(['data', 'a']);
		console.log(name);
	};
	return (
		<Form<FormStore>
			form={form}
			initialValues={{
				type: 'textarea',
				name: 'xxxx',
			}}>
			<FormField name="type" label="类型">
				<Select
					style={{
						width: 200,
					}}
					options={[
						{
							value: 'input',
							label: '输入框',
						},
						{
							value: 'textarea',
							label: '文本域',
						},
					]}
				/>
			</FormField>
			<FormField name={['data', 'name']} label="类型">
				<Select
					style={{
						width: 200,
					}}
					options={[
						{
							value: 'input',
							label: '输入框',
						},
						{
							value: 'textarea',
							label: '文本域',
						},
					]}
				/>
			</FormField>
			<FormField
				name="name"
				label="名称"
				dependency={[
					{
						type: 'props',
						relates: ['type'],
						setUp([type]) {
							return type === 'input'
								? {
									rules: [
										{
											required: true,
											message: '请输入名称',
										},
									],
									fieldProps: {
										placeholder: '请输入xxx',
									},
									disabled: true,
								}
								: {};
						},
					},
				]}>
				<Input />
			</FormField>
			<Button onClick={onBtn}>获取数据</Button>
		</Form>
	);
};
export default DependencyCase;
