/* eslint-disable @typescript-eslint/no-empty-function */
import Form, { Store, InternalNamePath } from '../../src';
let form: Form | undefined;
beforeEach(() => {
	form = new Form();
});
afterEach(() => {
	form = undefined;
});

describe('test case for form watch trigger', () => {
	test('should trigger once watch when setFieldValue', () => {
		const watch = vi.fn(() => {});
		if (form) {
			const { getInternalHooks, setFieldValue } = form.getForm();
			const { registerWatch } = getInternalHooks();
			registerWatch(watch);
			setFieldValue('test', 'test');
			expect(watch).toHaveBeenCalledTimes(1);
		}
	});

	test('should trigger once  watch when registerField', () => {
		const watch = vi.fn(() => {});
		if (form) {
			const { getInternalHooks } = form.getForm();
			const { registerWatch, registerField } = getInternalHooks();
			registerWatch(watch);
			registerField({
				getNamePath: () => ['test'],
				isPreserve: () => false,
			});
			expect(watch).toHaveBeenCalledTimes(1);
		}
	});

	test('should trigger once watch when setFieldsValue', () => {
		const watch = vi.fn(() => {});
		if (form) {
			const { getInternalHooks, setFieldsValue } = form.getForm();
			const { registerWatch } = getInternalHooks();
			registerWatch(watch);
			setFieldsValue({ test: 'test' });
			expect(watch).toHaveBeenCalledTimes(1);
		}
	});
	test('should trigger once watch when resetFields', () => {
		const watch = vi.fn(() => {});
		if (form) {
			const { getInternalHooks, resetFields } = form.getForm();
			const { registerWatch } = getInternalHooks();
			registerWatch(watch);
			resetFields();
			expect(watch).toHaveBeenCalledTimes(1);
		}
	});
	test('should trigger once watch when initValue and field initValue', () => {
		const watch = vi.fn(() => {});
		if (form) {
			const { getInternalHooks } = form?.getForm();
			const { registerWatch, registerField, setInitialValues } = getInternalHooks();
			registerWatch(watch);
			setInitialValues({ test: 'test' }, true);
			registerField({
				getNamePath: () => ['test'],
				isPreserve: () => false,
				props: {
					initialValue: 'test',
				},
			});
			expect(watch).toHaveBeenCalledTimes(1);
		}
	});
});

describe('test case for form watch data', () => {
	/** 检查触发watch之后数据是否正确 */
	test('should data is right watch when setFieldValue', () => {
		const watch = vi.fn(
			(store: Store, allStore: Store, namePathList: InternalNamePath[]) => {
				return {
					namePathList,
					store,
					allStore,
				};
			},
		);
		if (form) {
			const { getInternalHooks, setFieldValue } = form?.getForm();
			const { registerWatch } = getInternalHooks();
			registerWatch(watch);
			setFieldValue('test', 'test');
			expect(watch).toHaveBeenCalled();
			expect(watch).toHaveReturnedWith({
				namePathList: [['test']],
				store: {},
				allStore: {
					test: 'test',
				},
			});
		}
	});
});
