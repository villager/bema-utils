/**
 * Elo Test
 * based on https://github.com/dmamills/elo-rank
 */

import {EloRank} from '../src/elo';

describe('Elo', () => {
	it('Create instance', () => {
        const elo = new EloRank();
        return expect(elo).toBeInstanceOf(EloRank);
	});

	it('K factor should default to 32', () => {
        const elo = new EloRank();
        return expect(elo.factor).toEqual(32);
	});

	it('Should allow K factor to be set in constructor', () => {
        const elo = new EloRank(5);
        return expect(elo.factor).toEqual(5);
	});

	it('Should allow K factor to be set by setter', () => {
        const elo = new EloRank();
        elo.setFactor(20);
        return expect(elo.factor).toEqual(20);
	});

	it('should calculate expected properly', () => {
        const elo = new EloRank();
        return expect(elo.getExpected(1200, 1400)).toBeCloseTo(0.24025, 0.1);
	});

	it('Expect 50/50 chance for equal ranks', () => {
        const elo = new EloRank();
        return expect(elo.getExpected(1000, 1000)).toEqual(0.5);
	});

	it('should be almost 100% chance for 0 rank', () => {
        const elo = new EloRank();
        return expect(elo.getExpected(1000, 0)).toBeCloseTo(0.99, 0.01);
	});

	it('should update rating properly', () => {
        const elo = new EloRank();
		const expectedA = elo.getExpected(1200, 1400);
        const expectedB = elo.getExpected(1400, 1200);

		expect(elo.update(expectedA, 1, 1200)).toEqual(1224);
		expect(elo.update(expectedB, 0, 1400)).toEqual(1376);
	});

	it('should round rating properly', () => {
        const elo = new EloRank();
		const expectedA = elo.getExpected(1802, 1186);
		const expectedB = elo.getExpected(1186, 1802);
		expect(elo.update(expectedA, 1, 1802)).toEqual(1803);
		expect(elo.update(expectedB, 0, 1186)).toEqual(1185);
	});
});