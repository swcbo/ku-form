import { NamePath } from '../type';

export const getNamePath = (path?: NamePath) => {
  if (!path) return [];
  return toArray(path);
};

export const toArray = <T>(value?: T | T[]) => {
  if (value === undefined || value === null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
};
