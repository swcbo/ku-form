import { useState } from 'react';
import './App.css';
import Form, { useForm, useWatch } from '@hedone/form';

function App() {
  const [count, setCount] = useState(0);
  const [form] = useForm();
  const name = useWatch(['name'], { form });
  console.log(form, 'form', name);
  return (
    <>
      <Form>312312</Form>
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
