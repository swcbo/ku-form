import { StoreValue } from '@hedone/form-core';
import Schema, { Rule } from 'async-validator';
import { FieldInternalField } from '../types/field';
export const validateRule = async (
	value: StoreValue,
	{ rules = [], internalName }: FieldInternalField,
) => {
	const validator = new Schema({
		name: rules as Rule,
	});
	try {
		await validator.validate({ name: value });
	} catch (e) {
		const { errors } = e as { errors: { message: string }[] };
		if (errors) {
			return {
				name: internalName,
				errors: errors.map(({ message }: { message: string }) => message),
			};
		}
	}
	return void 0;
};
