import { useForm, useWatch } from '@hedone/form';
import { Radio } from 'antd';
import { useState } from 'react';
import './App.css';
import CaseList from './cases';

function App() {
	const [form] = useForm();
	const [currentCase, setCurrentCase] = useState(CaseList[0].title);
	const Component = CaseList.find((item) => item.title === currentCase)?.Component;
	return (
		<>
			<Radio.Group
				value={currentCase}
				onChange={(e) => setCurrentCase(e.target.value)}
				style={{ marginBottom: 12 }}>
				{CaseList.map((item) => (
					<Radio.Button value={item.title} key={item.title}>
						{item.title}
					</Radio.Button>
				))}
			</Radio.Group>
			{Component && <Component />}

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
