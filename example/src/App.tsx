import Form, { FormField, FormGroup, useForm, useWatch } from '@hedone/form';
import { useContext, useState } from 'react';
import './App.css';
import FieldContext from '@hedone/form/src/context/FieldContext';
const Test = () => {
	const name = useWatch(['user', 'name']);
	const fieldContext = useContext(FieldContext);
	console.log(fieldContext, name, 'fieldContext');
	return <>{name?.ccc}</>;
};

function App() {
	const [form] = useForm();
	const [show, setShow] = useState(true);

	return (
		<>
			<Form onFinish={console.log} form={form} layout="horizontal">
				{show ? (
					<FormGroup name="group1" layout="vertical" nameToPreFix>
						<FormField
							name={['user', 'name', 'ccc']}
							label="年龄"
							rules={[
								{
									required: true,
									message: '请输入年龄',
								},
							]}>
							<input placeholder="年龄1" />
						</FormField>
					</FormGroup>
				) : (
					<>321321</>
				)}
				<Test />
				<FormField name={['tags', 0, 'name']} label="名称">
					<input placeholder="名称" />
				</FormField>
				<button type="submit">提交</button>
				<button type="reset">重置</button>
			</Form>
			<div
				onClick={() => {
					setShow(!show);
				}}>
				显示隐藏
			</div>
			<div
				onClick={() => {
					console.log(form.getFieldsValue(), 'form.getFieldsValue()');
					console.log(
						form.getFieldsValue({ getStoreAll: true }),
						'form.getFieldsValue(all)',
					);
					console.log(
						form.getFieldValue(['user', 'name', 'ccc']),
						'form.getFieldValue()',
					);
				}}>
				点击获取数据
			</div>
			<div
				onClick={() => {
					form.setFieldValue(['user', 'name', 'ccc'], new Date().getTime() + '');
				}}>
				点击切换数据
			</div>
			<div
				onClick={() => {
					form.resetFields();
				}}>
				清空数据
			</div>
			<div
				onClick={() => {
					form.setFieldsValue({
						user: {
							name: {
								ccc: 'ces13',
							},
						},
					});
				}}>
				设置值
			</div>
			<div
				onClick={() => {
					console.log(
						form.isFieldsTouched({
							nameList: [['user', 'name', 'ccc']],
						}),
					);
				}}>
				查看是否修改
			</div>
			<div
				onClick={() => {
					form.validateFields({
						groupName: 'group2',
					});
				}}>
				校验组
			</div>
			<div
				onClick={() => {
					console.log(
						'group1',
						form.getFieldsValue({
							groupName: 'group1',
						}),
					);
					console.log(
						'group2',
						form.getFieldsValue({
							groupName: 'group2',
						}),
					);
				}}>
				获取组的值
			</div>
		</>
	);
}

export default App;
