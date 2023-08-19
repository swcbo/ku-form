import { InternalNamePath, StoreValue } from '@hedone/form-core';
import Schema, { Rule } from 'async-validator';
export const validateRule = async (
	value: StoreValue,
	rules: Rule[] = [],
	internalName: InternalNamePath,
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
