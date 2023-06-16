import Form from '../../src/form';

describe('test case for form-core instance', () => {
	/**
	 * 返回一个 form core class 的 实例
	 */
	it('should return a instance of form core class', () => {
		const form = new Form();
		expect(form).toBeInstanceOf(Form);
	});
	/**
	 * 当没有初始化值的时候，instance 获取 store 的值应该是 {}
	 */
	it('should return an empty object when get store value without init value', () => {
		const form = new Form();
		const { getFieldsValue } = form.getForm();
		expect(getFieldsValue({ getStoreAll: true })).toEqual({});
	});
	/**
	 * 当初始值为 { count: number } 类型的时候，instance 获取 store 的值应该是 { count: number }
	 */
	it('should return number when get store value with init value is number', () => {
		const form = new Form({
			count: 1,
		});
		const { getFieldsValue } = form.getForm();
		expect(getFieldsValue({ getStoreAll: true })).toEqual({ count: 1 });
	});
});
