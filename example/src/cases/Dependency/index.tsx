import Form, { FormField } from '@hedone/form';
import { Input, Select } from 'antd';

const DependencyCase = () => {
	return (
		<Form
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
								}
								: {};
						},
					},
				]}>
				<Input placeholder="请输入" />
			</FormField>
		</Form>
	);
};
export default DependencyCase;
