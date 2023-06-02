import { toArray } from "../../src/utils/typeUtils";

describe('test case for toArray', () => {
    it('should return empty array when value is undefined', () => {
        const res = toArray();
        expect(res).toEqual([]);
    })
})