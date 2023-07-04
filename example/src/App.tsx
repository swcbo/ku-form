import Form, { FormField, useForm, useWatch } from '@hedone/form';
import './App.css';
import { useState } from 'react';
function App() {
	const [form] = useForm();
	const [show, setShow] = useState(true);
	const name = useWatch(['user', 'name'], { form });
	console.log('watch', name);
	return (
		<>
			<Form form={form} onFinish={console.log} onReset={console.log}>
				{show ? (
					<FormField name={['user', 'name']} initialValue="测试">
						<input placeholder="请输入问题" />
					</FormField>
				) : (
					<>321321</>
				)}
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
				}}>
				点击获取数据
			</div>
			<div
				onClick={() => {
					form.setFieldValue(['user', 'name'], new Date().getTime() + '');
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
							name: '测试哇',
						},
					});
				}}>
				设置值
			</div>
			<div
				onClick={() => {
					console.log(
						form.isFieldsTouched({
							nameList: [['user', 'name']],
						}),
					);
				}}>
				查看是否修改
			</div>
		</>
	);
}

export default App;
