import Form from '../../src/form';

describe('test case for form-core instance', () => {
  const form = new Form();
  it('should return form instance', () => {
    expect(form).toBeInstanceOf(Form);
  });
  const watch = () => {
    return 'watch';
  };
  it('add watch return #watchMap', () => {
    form.getForm().getInternalHooks().registerWatch(watch);
  });
});
