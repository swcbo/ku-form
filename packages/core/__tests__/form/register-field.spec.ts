import { FieldEntity } from '../../src/type';
import Form from '../../src/form';
let form: Form | undefined;
beforeEach(() => {
	form = new Form();
});
afterEach(() => {
	form = undefined;
});
describe('test case for form fieldEntities', () => {
	it('should fieldEntities is right when registerField', () => {
		if (form) {
			const { getInternalHooks } = form.getForm();
			const { registerField } = getInternalHooks();
			const field: FieldEntity = {
				getNamePath: () => ['test'],
				isPreserve: () => false,
			};
			registerField(field);
			//   expect(getFields()).toEqual([field]);
		}
	});
});

describe('test case for registerField and set default props value', () => {
	it('should store is right when registerField and set default props value', () => {
		if (form) {
			const { getInternalHooks } = form.getForm();
			const { registerField } = getInternalHooks();
			const field: FieldEntity = {
				getNamePath: () => ['test'],
				isPreserve: () => false,
				props: {
					initialValue: 'test',
					name: 'test',
				},
			};
			registerField(field);
			expect(form?.getForm().getFieldValue('test')).toEqual('test');
		}
	});
});
