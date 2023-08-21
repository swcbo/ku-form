import { memo, useCallback, useContext, useRef } from 'react';
import { FormListProps } from '../../types/list';
import { InternalNamePath, StoreValue, getNamePath, toArray } from '@hedone/form-core';
import FieldContext from '../../context/FieldContext';
import FormField from '../FormField';
import { moveField } from '../../utils/valueUtils';

const FormList = ({ children, onChange, value = [], name }: FormListProps) => {
	const { prefixName: names = [], ...reset } = useContext(FieldContext);
	const prefixName = useRef<InternalNamePath>([]);
	prefixName.current = [...names, ...getNamePath(name)];
	const keyRef = useRef<{ keys: number[]; id: number }>({
		keys: [],
		id: value?.length || 0,
	});
	keyRef.current.keys = (value || []).map((_, i) => i);
	/** 添加 */
	const add = useCallback(
		(defaultValue?: StoreValue | StoreValue[], index?: number) => {
			if (typeof index === 'number' && index >= 0 && index <= value.length) {
				onChange([
					...value.slice(0, index),
					...toArray(defaultValue),
					...value.slice(index),
				]);
			} else {
				onChange([...value, ...toArray(defaultValue)]);
			}

			keyRef.current.id += 1;
		},
		[value, onChange],
	);

	/** 删除 */
	const remove = useCallback(
		(index: number | number[]) => {
			const indexSet = new Set(getNamePath(index));
			if (indexSet.size <= 0) {
				return;
			}
			const filterFun = (_: number, index: number) => !indexSet.has(index);
			onChange(value.filter(filterFun));
		},
		[value, onChange],
	);
	/** 移动 */
	const move = useCallback(
		(from: number, to: number) => {
			if (from === to) {
				return;
			}
			if (from < 0 || from >= value.length || to < 0 || to >= value.length) {
				return;
			}
			keyRef.current.keys = moveField(keyRef.current.keys, from, to);
			onChange(moveField(value, from, to));
		},
		[value, onChange],
	);

	return (
		<FieldContext.Provider
			value={{
				...reset,
				prefixName: prefixName.current,
			}}>
			{children(
				keyRef.current.keys.map((key, index) => {
					return {
						name: index,
						key,
					};
				}),
				{
					add,
					move,
					remove,
				},
			)}
		</FieldContext.Provider>
	);
};
type WrapperFormListProps = Pick<FormListProps, 'name' | 'children' | 'initialValue'>;

const WrapperFormList = ({ name, children, initialValue }: WrapperFormListProps) => {
	return (
		<FormField name={name} initialValue={initialValue} noStyle>
			{({ value, onChange }) => {
				return (
					<FormList name={name} value={value} onChange={onChange}>
						{children}
					</FormList>
				);
			}}
		</FormField>
	);
};
export default memo(WrapperFormList);
