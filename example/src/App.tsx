import Form, { FormField, useForm, useWatch } from '@hedone/form';
import { useState } from 'react';
import './App.css';

function App() {
	const [form] = useForm();
	const [show, setShow] = useState(true);
	const cccc = useWatch(['user', 'name', 'ccc'], { form });
	const name = useWatch(['user', 'name'], { form });

	console.log(cccc, 'cccc', name, 'name');
	return (
		<>
			<Form
				form={form}
				initialValues={{
					user: {
						name: {
							ccc: 'ces',
						},
					},
				}}>
				{show ? (
					<FormField name={['user', 'name', 'ccc']} preserve={false}>
						<input placeholder="请输入问题" />
					</FormField>
				) : (
					<>321321</>
				)}
				<FormField name={['user', 'name']}>
					<input placeholder="年龄" />
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
