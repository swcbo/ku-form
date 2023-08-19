import Form, { FormField, LayoutType, useForm } from '@hedone/form';
import { Button, Input, Radio } from 'antd';
import { useState } from 'react';

const LayoutCase: React.FC = () => {
	const [form] = useForm();
	const [formLayout, setFormLayout] = useState<LayoutType>('horizontal');

	const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
		setFormLayout(layout);
	};

	const formItemLayout =
		formLayout === 'horizontal'
			? { labelCol: { span: 4 }, wrapperCol: { span: 14 } }
			: null;

	const buttonItemLayout =
		formLayout === 'horizontal' ? { wrapperCol: { span: 14, offset: 4 } } : null;

	return (
		<Form
			{...formItemLayout}
			layout={formLayout}
			form={form}
			onValuesChange={onFormLayoutChange}
			initialValues={{ layout: formLayout }}
			style={{ maxWidth: formLayout === 'inline' ? 'none' : 600 }}>
			<FormField label="Form Layout" name="layout">
				<Radio.Group value={formLayout}>
					<Radio.Button value="horizontal">Horizontal</Radio.Button>
					<Radio.Button value="vertical">Vertical</Radio.Button>
					<Radio.Button value="inline">Inline</Radio.Button>
				</Radio.Group>
			</FormField>
			<FormField label="Field A">
				<Input placeholder="input placeholder" />
			</FormField>
			<FormField label="Field B">
				<Input placeholder="input placeholder" />
			</FormField>
			<FormField {...buttonItemLayout}>
				<Button type="primary">Submit</Button>
			</FormField>
		</Form>
	);
};
export default LayoutCase;
