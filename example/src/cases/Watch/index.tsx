import Form, { FormField, useForm, useWatch } from '@hedone/form';
import { Input, Button, Descriptions, Space } from 'antd';
import { useState } from 'react';

const Test = () => {
	const name = useWatch('name');
	return <>{name}</>;
};
const PreserveTest = () => {
	const name = useWatch('name', {
		preserve: true,
	});
	return <>{name}</>;
};
const WatchCase = () => {
	const [form] = useForm();
	const [show, setShow] = useState(false);
	const name = useWatch('name', {
		form,
	});
	return (
		<Form form={form}>
			{show && (
				<FormField name="name" label="名称" initialValue="test">
					<Input placeholder="名称" />
				</FormField>
			)}
			<Space direction="vertical">
				<Descriptions bordered column={1}>
					<Descriptions.Item label="子组件">
						<Test />
					</Descriptions.Item>
					<Descriptions.Item label="preserve">
						<PreserveTest />
					</Descriptions.Item>
					<Descriptions.Item label="同层">{name}</Descriptions.Item>
				</Descriptions>
				<Button
					type="primary"
					onClick={() => {
						setShow(!show);
					}}>
					{show ? '隐藏' : '显示'}
				</Button>
			</Space>
		</Form>
	);
};
export default WatchCase;
