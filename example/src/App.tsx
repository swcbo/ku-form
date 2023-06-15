import { useState } from 'react';
import './App.css';
import Form, { FormField, useForm, useWatch } from '@hedone/form';

function App() {
  const [count, setCount] = useState(0);
  const [form] = useForm();
  const name = useWatch(['name'], { form });
  console.log(form, 'form', name);
  return (
    <>
      <Form form={form} initialValues={{ name: '筱白' }}>
        <FormField name="name">
          <input placeholder="请输入问题" />
        </FormField>
      </Form>
      <div
        onClick={() => {
          console.log(form.getFieldValue('name'), 'form.getFieldsValue()');
        }}>
        点击获取数据
      </div>
      <div
        onClick={() => {
          form.setFieldValue('name', new Date().getTime() + '');
        }}>
        点击切换数据
      </div>
    </>
  );
}

export default App;
