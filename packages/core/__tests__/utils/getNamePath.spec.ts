import { getNamePath } from '../../src/utils/typeUtils';

describe('test case for getNamePath', () => {
  it('should return empty array when value is undefined', () => {
    const res = getNamePath();
    expect(res).toEqual([]);
  });
});
