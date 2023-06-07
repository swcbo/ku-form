import { expectTypeOf } from 'vitest';
import Form from '../../src/form';

type Count<T> = {
  count: T;
};

describe('test case for form-core class', () => {
  /**
   * 判断 Form 类的实例是否可以访问 public 属性 getForm
   */
  test('Check if the instance of Form is accessible to the public property getForm', () => {
    expectTypeOf(Form).instance.toHaveProperty('getForm');
  });
});
describe('test case for form-core class inner instance', () => {
  const form = new Form();
  const instance = form.getForm();
  /**
   * 判断 Form 类的实例下的 内容部实例 是否可以访问 getFieldValue 属性
   */
  test('Check if the inner instance of Form is accessible to the private property getFieldValue', () => {
    expectTypeOf(instance).toHaveProperty('getFieldValue');
  });
  /**
   * 判断 Form 类的实例下的 内容部实例 是否可以访问 getFieldValue 属性
   */
  test('Check if the inner instance of Form is accessible to the private property getFieldsValue', () => {
    expectTypeOf(instance).toHaveProperty('getFieldsValue');
  });
  /**
   * 判断 Form 类的实例下的 内容部实例 是否可以访问 setFieldValue 属性
   */
  test('Check if the inner instance of Form is accessible to the private property setFieldValue', () => {
    expectTypeOf(instance).toHaveProperty('setFieldValue');
  });
  /**
   * 判断 Form 类的实例下的 内容部实例 是否可以访问 setFieldsValue 属性
   */
  test('Check if the inner instance of Form is accessible to the private property setFieldsValue', () => {
    expectTypeOf(instance).toHaveProperty('setFieldsValue');
  });
  /**
   * 判断 Form 类的实例下的 内容部实例 是否可以访问 resetFields 属性
   */
  test('Check if the inner instance of Form is accessible to the private property resetFields', () => {
    expectTypeOf(instance).toHaveProperty('resetFields');
  });
  /**
   * 判断 Form 类的实例下的 内容部实例 是否可以访问 validateFields 属性
   */
  test('Check if the inner instance of Form is accessible to the private property validateFields', () => {
    expectTypeOf(instance).toHaveProperty('validateFields');
  });
  /**
   * 判断 Form 类的实例下的 内容部实例 是否可以访问 getInternalHooks 属性
   */
  test('Check if the inner instance of Form is accessible to the private property getInternalHooks', () => {
    expectTypeOf(instance).toHaveProperty('getInternalHooks');
  });
  /**
   * 判断 Form 类的实例下的 内容部实例 是否可以访问 isFieldsTouched 属性
   */
  test('Check if the inner instance of Form is accessible to the private property isFieldsTouched', () => {
    expectTypeOf(instance).toHaveProperty('isFieldsTouched');
  });
  /**
   * 判断 Form 类的实例下的 内容部实例 是否可以访问 submit 属性
   */
  test('Check if the inner instance of Form is accessible to the private property submit', () => {
    expectTypeOf(instance).toHaveProperty('submit');
  });
  //   /**
  //    * 当初始值为 { count: number } 类型的时候，instance 获取 store 的类型应该是 { count: number }
  //    */
  //   test('store type ({ count: number }) when get store value with init value is type { count: number }', () => {
  //     const initialValues: Count<number> = {
  //       count: 1,
  //     };
  //     const form = new Form(initialValues);
  //     const { getFieldsValue } = form.getForm();
  //     const store = getFieldsValue({ getStoreAll: true });
  //     expectTypeOf(store).toEqualTypeOf<Partial<Count<number>>>();
  //   });
  //   it('should return type { count: string } when get store value with init value is not type { count: number }', () => {
  //     const initialValues = {
  //       count: '1',
  //     };
  //     const form = new Form(initialValues);
  //     const { getFieldsValue } = form.getForm();
  //     const store = getFieldsValue({ getStoreAll: true });
  //     expectTypeOf(store).not.toEqualTypeOf<{ count: number }>();
  //   });
});
