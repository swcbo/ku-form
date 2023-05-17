import { FieldEntity, NameCollection, NamePath } from '../type';

export const getNamePathByNameCollection = (
  { groupName, nameList }: NameCollection = {},
  entities: FieldEntity[],
): FieldEntity[] => {
  let namePathSet: Set<FieldEntity> = new Set();
  if (groupName) {
    const nameList = entities.filter(
      (item) => `${item.getGroupNamePath()}` === `${groupName}`,
    );
    namePathSet = new Set(nameList);
  }
  if (nameList) {
    entities.forEach((item) => {
      nameList.forEach((name) => {
        if (`${item.getNamePath()}` === `${name}`) {
          namePathSet.add(item);
        }
      });
    });
  }
  return Array.from(namePathSet);
};
