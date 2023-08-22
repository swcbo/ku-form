import Form, { FormField, FormList, useForm } from '@hedone/form';
import { Button, Input, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const FormListCase = () => {
	const [form] = useForm();
	return (
		<Form form={form} onFinish={console.log}>
			<FormList
				name="list"
				initialValue={[{}]}
				rules={[
					{
						validator: (_, names, callback) => {
							if (!names || names.length < 2) {
								callback(new Error('At least 2 passengers'));
							}
							callback();
						},
					},
				]}>
				{(fields, { add, remove }) => (
					<>
						<Space>
							<Button type="dashed" onClick={() => add({})} icon={<PlusOutlined />}>
								Add field
							</Button>
							<Button
								type="dashed"
								onClick={() => {
									add('The head item', 0);
								}}
								icon={<PlusOutlined />}>
								Add field at head
							</Button>
						</Space>
						<div
							style={{
								marginTop: 12,
							}}>
							{fields.map(({ name, key }) => (
								<Space key={key}>
									<FormField name={[name, 'name']}>
										<Input />
									</FormField>
									{fields.length > 1 ? (
										<MinusCircleOutlined
											className="dynamic-delete-button"
											onClick={() => remove(name)}
										/>
									) : null}
									{key}
								</Space>
							))}
						</div>
					</>
				)}
			</FormList>
			<Button htmlType="submit">Submit</Button>
		</Form>
	);
};
export default FormListCase;
