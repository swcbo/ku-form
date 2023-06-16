import { expectTypeOf } from 'vitest';
import Form from '../../src/form';

type Count<T> = {
	count: T;
};

describe('test case for form-core instance typing', () => {
	/**
	 * 判断 Form 类的实例是否有 getForm 属性
	 */
	test('check properties in form core class instance', () => {
		expectTypeOf(Form).instance.toHaveProperty('getForm');
	});
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
	 * 当初始值为 { count: number } 类型的时候，instance 获取 store 的类型应该是 { count: number }
	 */
	test('store type ({ count: number }) when get store value with init value is type { count: number }', () => {
		const initialValues: Count<number> = {
			count: 1,
		};
		const form = new Form(initialValues);
		const { getFieldsValue } = form.getForm();
		const store = getFieldsValue({ getStoreAll: true });
		expectTypeOf(store).toEqualTypeOf<Partial<Count<number>>>();
	});
	it('should return type { count: string } when get store value with init value is not type { count: number }', () => {
		const initialValues = {
			count: '1',
		};
		const form = new Form(initialValues);
		const { getFieldsValue } = form.getForm();
		const store = getFieldsValue({ getStoreAll: true });
		expectTypeOf(store).not.toEqualTypeOf<{ count: number }>();
	});
});
