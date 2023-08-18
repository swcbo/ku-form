import Form, { FormField, useForm, useWatch } from '@hedone/form';
import { useState } from 'react';
import './App.css';
const Test = () => {
	const name = useWatch(['user', 'name']);
	return <>{name?.ccc}</>;
};

function App() {
	const [form] = useForm();
	const [show, setShow] = useState(true);

	return (
		<>
			<Form
				form={form}
				initialValues={{
					user: {
						name: {
							ccc: '312312',
						},
					},
				}}>
				{show ? (
					<FormField name={['user', 'name', 'ccc']} label="年龄">
						<input placeholder="年龄1" />
					</FormField>
				) : (
					<>321321</>
				)}
				<Test />
				<FormField name={['tags', 0, 'name']}>
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
		</>
	);
}

export default App;
