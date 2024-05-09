import { getValue, NamePath, StoreValue, TDependency } from '@hedone/form-core';
import { MutableRefObject, useContext, useEffect } from 'react';
import { FieldInstance, FieldMate } from '../types/field';
import FormContext from '../context/FormContext';
import useForcedUpdate from './useForceUpdate';
const useDependency = (
	fieldInstance: MutableRefObject<FieldInstance>,
	meta: MutableRefObject<FieldMate>,
	dependency?: TDependency[],
) => {
	const formContext = useContext(FormContext);
	const [forcedUpdate] = useForcedUpdate();
	useEffect(() => {
		if (dependency) {
			const { getInternalHooks, setFieldValue, getFieldsValue } = formContext;
			const { registerWatch } = getInternalHooks();
			const doDependency = async (namePathList: NamePath[], force = false) => {
				const allValues = getFieldsValue();
				const pathObj = namePathList.reduce((pre, cur) => {
					pre.add(`${cur}`);
					return pre;
				}, new Set<string>());
				const actions: Promise<void>[] = [];
				let value: StoreValue;
				let valueChange = false;
				dependency.forEach(({ relates, ...reset }) => {
					const innerRelates = Array.isArray(relates)
						? relates
						: relates(fieldInstance.current.prefixName as NamePath);
					const isRelate = force ? true : innerRelates.some((v) => pathObj.has(`${v}`));
					const values = innerRelates.reduce((pre, v) => {
						pre.push(getValue(allValues, v));
						return pre;
					}, [] as StoreValue[]);

					if (isRelate) {
						if ('type' in reset) {
							actions.push(
								(async () => {
									const actionValue = reset.setUp(values);
									switch (reset.type) {
										case 'props':
											meta.current.props = await actionValue;
											break;
										case 'value':
											value = await actionValue;
											valueChange = true;
											break;
										case 'visible':
											meta.current.visible = await actionValue;
											break;
									}
								})(),
							);
						} else {
							actions.push(
								(async () => {
									await reset.setUp(values, {
										setProps: (props) => (meta.current.props = props),
									});
								})(),
							);
						}
					}
				});
				await Promise.allSettled(actions);
				if (valueChange && fieldInstance.current.internalName) {
					setFieldValue(fieldInstance.current.internalName, value);
				} else {
					forcedUpdate();
				}
			};
			doDependency([], true);
			return registerWatch(async ({ namePathList }) => {
				await doDependency(namePathList);
			});
		}
	}, [dependency, fieldInstance, forcedUpdate, formContext, meta]);
};

export default useDependency;
