import { StoreValue } from '@hedone/form-core';
import { ReactNode } from 'react';
import { FormFieldProps } from './field';

interface FormListOperation {
	/** 添加节点 */
	add: (defaultValue?: StoreValue | StoreValue[], insertIndex?: number) => void;
	/** 删除节点 */
	remove: (index: number | number[]) => void;
	/** 移动节点 */
	move: (from: number, to: number) => void;
}
export interface FormListData {
	name: number;
	key: number;
}
export interface FormListProps extends Pick<FormFieldProps, 'name' | 'initialValue'> {
	children: (fields: FormListData[], operation: FormListOperation) => ReactNode;
	value?: StoreValue[];
	onChange: (value: StoreValue[]) => void;
}
