import Form, { FormField, FormList, useForm } from '@hedone/form';
import { Button, Input, Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

const FormListCase = () => {
	const [form] = useForm();
	return (
		<Form form={form} onFinish={console.log}>
			<FormList name="list">
				{(fields, { add, remove }) => (
					<>
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
							</Space>
						))}
						<FormField>
							<Button
								type="dashed"
								onClick={() => add({})}
								style={{ width: '60%' }}
								icon={<PlusOutlined />}>
								Add field
							</Button>
							<Button
								type="dashed"
								onClick={() => {
									add('The head item', 0);
								}}
								style={{ width: '60%', marginTop: '20px' }}
								icon={<PlusOutlined />}>
								Add field at head
							</Button>
						</FormField>
					</>
				)}
			</FormList>
			<Button htmlType="submit">Submit</Button>
		</Form>
	);
};
export default FormListCase;
