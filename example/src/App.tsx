import Form, { FormField, useForm, useWatch } from '@hedone/form';
import './App.css';

function App() {
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
          console.log(
            form.getFieldsValue({
              getStoreAll: true,
            }),
            'form.getFieldsValue()',
          );
        }}>
        点击获取数据
      </div>
      <div
        onClick={() => {
          form.setFieldValue('name', new Date().getTime() + '');
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
            name: 'name',
          });
        }}>
        设置值
      </div>
      <div
        onClick={() => {
          console.log(
            form.isFieldsTouched({
              nameList: ['name'],
            }),
          );
        }}>
        查看是否修改
      </div>
    </>
  );
}

export default App;
