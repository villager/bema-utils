/**
 * Testing Package Utilitys
 *
 */

import {Package} from '../src/package';

describe('Package', () => {
    it('Exists Base', () => {
        const packageBase = new Package();
        return expect(packageBase.exists).toBe(true);
    });
    it('Exists test package', () => {
        const packageTests = new Package('./__tests__');
        return expect(packageTests.exists).toBe(false);
    });
    it('Create package test', () => {
        const packageTests = new Package('./__tests__');
        packageTests.creator({
            "author": {
                "name": "Aldair Beltran",
            },
        });
        return expect(packageTests.exists).toBe(true);
    });
    it('Remove package test', () => {
        const packageTests = new Package('./__tests__');
        return expect(packageTests.remove()).toBe(true);
    });
});