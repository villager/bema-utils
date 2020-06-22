
import {UtilSet} from '../src/set';

const set = new UtilSet();

describe('Set', () => {
    it('Length', () => {
        return expect(set.length).toBe(0);
    });
    it('toJSON', () => {
        return expect(set.toJSON()).toStrictEqual([]);
    });
    describe('Union', () => {
        it('Array', () => {
            const items = ['a', 'e'];
            set.union(items);
            return expect(set.toJSON()).toStrictEqual(['a', 'e']);
        });
        it('Object', () => {
            const items = {
                'i': {},
                'o': {},
            };
            set.union(items);
            return expect(set.toJSON()).toStrictEqual(['a', 'e', 'i', 'o']);
        });
        it('Any', () => {
            set.union(() => {});
            return expect(set.length).toBe(5);
        });
    });
});
