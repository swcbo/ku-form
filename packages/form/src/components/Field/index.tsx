import FieldContext from '@/context/FieldContext';
import FormContext from '@/context/FormContext';
import useRefUpdate from '@/hooks/useRefUpdate';
import { EventArgs, FieldProps } from '@/types/field';
import { getEventDefaultValue } from '@/utils/valueUtils';
import { FieldInjectProps, getNamePath, StoreValue, toArray } from '@hedone/form-core';
import { cloneElement, isValidElement, useContext, useEffect } from 'react';

const Field = ({ children, ...props }: FieldProps) => {
  const formContext = useContext(FormContext);
  const scopeContext = useContext(FieldContext);
  const fieldInstance = useRefUpdate({
    ...props,
    internalName: [...getNamePath(scopeContext.prefixName), ...getNamePath(props.name)],
    disabled:
      props.disabled ?? scopeContext.props.disabled ?? formContext.disabled ?? false,
    colon: formContext.colon ?? scopeContext.props.colon ?? props.colon ?? true,

    mate: {
      touched: false,
    },
  });

  useEffect(() => {
    const internalHooks = formContext.getInternalHooks();
    return internalHooks.registerField({
      isFieldTouched: () => fieldInstance.current.mate.touched,
      getNamePath: () => fieldInstance.current.internalName,
      isPreserve: () => fieldInstance.current.preserve,
      // validate,
      props: fieldInstance.current,
    });
  }, []);

  const WrapperChild = () => {
    const {
      mate,
      rules,
      normalize,
      internalName,
      trigger = 'onChange',
      validateTrigger = formContext.validateTrigger,
      valuePropName = 'value',
      getValueFromEvent,
    } = fieldInstance.current;
    const { dispatch } = formContext.getInternalHooks();
    const value = formContext.getFieldValue(internalName);
    const control: FieldInjectProps = {
      ...props,
      [valuePropName]: value,
    };
    /** proxy trigger */
    const originTrigger = control[trigger];
    control[trigger] = (...args: EventArgs) => {
      mate.touched = true;
      let currentValue: StoreValue;
      if (getValueFromEvent) {
        currentValue = getValueFromEvent(...args);
      } else {
        currentValue = getEventDefaultValue(valuePropName, ...args);
      }
      normalize?.(currentValue, value, formContext.getFieldsValue());
      dispatch({
        type: 'updateValue',
        namePath: internalName,
        value: currentValue,
        source: 'trigger',
      });
      originTrigger?.(...args);
    };
    /** proxy validate */
    const validateTriggerList: string[] = toArray(validateTrigger) || [];
    validateTriggerList.forEach((triggerName) => {
      const originTrigger = control[triggerName];
      control[triggerName] = (...args: EventArgs) => {
        originTrigger?.(...args);
        if (rules && rules.length) {
          dispatch({
            type: 'validateField',
            namePath: internalName,
            triggerName,
          });
        }
      };
    });

    const isFunction = typeof children === 'function';

    if (isFunction) {
      return children(control, formContext);
    } else if (isValidElement(children)) {
      return cloneElement(children, control);
    } else {
      console.warn('children must be function or ReactElement');
      return children;
    }
  };

  return (
    <FieldContext.Provider value={scopeContext}>
      <div className="form-field">{WrapperChild()}</div>
    </FieldContext.Provider>
  );
};
export default Field;
