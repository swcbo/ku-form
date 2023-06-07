import { expectTypeOf } from 'vitest';
import Form from '@/form';

describe('test case for form-core instance typing', () => {
  /**
   * 检查 Form 的实例 是否 可以访问 private 属性 setInitialValues
   */
  test('Check if the instance of Form is inaccessible to the private property setInitialValues', () => {
    expectTypeOf(Form).instance.not.toHaveProperty('setInitialValues');
  });
  /**
   * 检查 Form 的实例 是否 可以访问 private 属性 registerField
   */
  test('Check if the instance of Form is inaccessible to the private property registerField', () => {
    expectTypeOf(Form).instance.not.toHaveProperty('registerField');
  });
  /**
   * 检查 Form 的实例 是否 可以访问 private 属性 setInitialValues
   */
  test('Check if the instance of Form is inaccessible to the private property registerWatch', () => {
    expectTypeOf(Form).instance.not.toHaveProperty('registerWatch');
  });
  /**
   * 检查 Form 的实例 是否 可以访问 private 属性 triggerWatch
   */
  test('Check if the instance of Form is inaccessible to the private property triggerWatch', () => {
    expectTypeOf(Form).instance.not.toHaveProperty('triggerWatch');
  });
  /**
   * 检查 Form 的实例 是否 可以访问 private 属性 proxyStore
   */
  test('Check if the instance of Form is inaccessible to the private property proxyStore', () => {
    expectTypeOf(Form).instance.not.toHaveProperty('proxyStore');
  });
  /**
   * 检查 Form 的实例 是否 可以访问 private 属性 getInitialValue
   */
  test('Check if the instance of Form is inaccessible to the private property getInitialValue', () => {
    expectTypeOf(Form).instance.not.toHaveProperty('getInitialValue');
  });
  /**
   * 检查 Form 的实例 是否 可以访问 private 属性 isMergedPreserve
   */
  test('Check if the instance of Form is inaccessible to the private property isMergedPreserve', () => {
    expectTypeOf(Form).instance.not.toHaveProperty('isMergedPreserve');
  });
  /**
   * 检查 Form 的实例 是否 可以访问 private 属性 getInternalHooks
   */
  test('Check if the instance of Form is inaccessible to the private property getInternalHooks', () => {
    expectTypeOf(Form).instance.not.toHaveProperty('getInternalHooks');
  });
  /**
   * 检查 Form 的实例 是否 可以访问 private 属性 dispatch
   */
  test('Check if the instance of Form is inaccessible to the private property dispatch', () => {
    expectTypeOf(Form).instance.not.toHaveProperty('dispatch');
  });
  /**
   * 检查 Form 的实例 是否 可以访问 private 属性 updateStore
   */
  test('Check if the instance of Form is inaccessible to the private property updateStore', () => {
    expectTypeOf(Form).instance.not.toHaveProperty('updateStore');
  });
  /**
   * 检查 Form 的实例 是否 可以访问 private 属性 setCallbacks
   */
  test('Check if the instance of Form is inaccessible to the private property setCallbacks', () => {
    expectTypeOf(Form).instance.not.toHaveProperty('setCallbacks');
  });
  /**
   * 检查 Form 的实例 是否 可以访问 private 属性 setPreserve
   */
  test('Check if the instance of Form is inaccessible to the private property setPreserve', () => {
    expectTypeOf(Form).instance.not.toHaveProperty('setPreserve');
  });
  /**
   * 检查 Form 的实例 是否 可以访问 private 属性 updateValue
   */
  test('Check if the instance of Form is inaccessible to the private property updateValue', () => {
    expectTypeOf(Form).instance.not.toHaveProperty('updateValue');
  });
  /**
   * 检查 Form 的实例 是否 可以访问 private 属性 getFieldValue
   */
  test('Check if the instance of Form is inaccessible to the private property getFieldValue', () => {
    expectTypeOf(Form).instance.not.toHaveProperty('getFieldValue');
  });
  /**
   * 检查 Form 的实例 是否 可以访问 private 属性 getFieldsValue
   */
  test('Check if the instance of Form is inaccessible to the private property getFieldsValue', () => {
    expectTypeOf(Form).instance.not.toHaveProperty('getFieldsValue');
  });
  /**
   * 检查 Form 的实例 是否 可以访问 private 属性 setFieldValue
   */
  test('Check if the instance of Form is inaccessible to the private property setFieldsValue', () => {
    expectTypeOf(Form).instance.not.toHaveProperty('setFieldsValue');
  });
  /**
   * 检查 Form 的实例 是否 可以访问 private 属性 getFieldsValue
   */
  test('Check if the instance of Form is inaccessible to the private property resetFields', () => {
    expectTypeOf(Form).instance.not.toHaveProperty('resetFields');
  });
  /**
   * 检查 Form 的实例 是否 可以访问 private 属性 isFieldsTouched
   */
  test('Check if the instance of Form is inaccessible to the private property isFieldsTouched', () => {
    expectTypeOf(Form).instance.not.toHaveProperty('isFieldsTouched');
  });
  /**
   * 检查 Form 的实例 是否 可以访问 private 属性 submit
   */
  test('Check if the instance of Form is inaccessible to the private property submit', () => {
    expectTypeOf(Form).instance.not.toHaveProperty('submit');
  });
  /**
   * 检查 Form 的实例 是否 可以访问 private 属性 validateFields
   */
  test('Check if the instance of Form is inaccessible to the private property validateFields', () => {
    expectTypeOf(Form).instance.not.toHaveProperty('validateFields');
  });
});
