import Form from '../../src/form';
import { Store, InternalNamePath } from '../../src';
let form: Form | undefined;
beforeEach(() => {
  form = new Form();
});
afterEach(() => {
  form = undefined;
});

describe('test case for form watch trigger', () => {
  it('should trigger watch when setFieldValue', () => {
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
      expect(watch).toHaveBeenCalledTimes(1);
    }
  });
});

describe('test case for form watch data', () => {
  /** 检查触发watch之后数据是否正确 */
  it('should data is right watch when setFieldValue', () => {
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

it('should trigger watch when registerField', () => {
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
    const { getInternalHooks } = form?.getForm();
    const { registerWatch, registerField } = getInternalHooks();
    registerWatch(watch);
    registerField({
      getNamePath: () => ['test'],
      isPreserve: () => false,
    });
    expect(watch).toHaveBeenCalled();
    expect(watch).toHaveBeenCalledTimes(1);
  }
});
