import { FieldEntity, NameCollection, NamePath } from '../type';

/** Compare if namepath is equal. */
export const compareNamePath = (namePath1?: NamePath, namePath2?: NamePath) => {
	return `${namePath1}` === `${namePath2}`;
};

/** Return field entities from the collection. If the collection is not passed, return all field entities. */
export const getFieldEntitiesByCollection = (
	{ scopeName, nameList }: NameCollection = {},
	entities: Map<string, FieldEntity>,
): FieldEntity[] => {
	let namePathSet: Set<FieldEntity> = new Set();
	if (scopeName) {
		const nameList = [...entities.values()].filter((item) =>
			compareNamePath(item.getNamePath(), scopeName),
		);
		namePathSet = new Set(nameList);
	}
	if (nameList) {
		entities.forEach((item) => {
			nameList.forEach((name) => {
				if (compareNamePath(name, item.getNamePath())) {
					namePathSet.add(item);
				}
			});
		});
	}
	if (!scopeName && !nameList) {
		namePathSet = new Set(entities.values());
	}
	return Array.from(namePathSet);
};
