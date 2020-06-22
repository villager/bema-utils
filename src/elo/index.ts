/**
 * Elo Rank
 *
 * @author dmamills
 */

export class EloRank {
    k: number;
    constructor(k?: number) {
        this.k = k || 32;
    }

    setFactor(k: number) {
        this.k = k;
    }

    get factor() {
        return this.k;
    }

    getExpected(a: number, b: number) {
        return 1 / (1 + Math.pow(10, ((b - a) / 400)));
    }

    update(expected: number, actual: number, current: number) {
        return Math.round(current + this.k * (actual - expected));
    }
}