/***
 * Test Bin's Utility
 */

import {Hastebin, Pastie} from '../src/bins';


const text = 'This is a test';

describe("Hastebin", () => {
    let link: any;
    it("Upload", async () => {
        const hasteLink = await Hastebin.upload(text);
        link = hasteLink;
        return expect(hasteLink).toBeDefined();
    });

    it("Link is defined", () => {
        return expect(link).toBeDefined();
    });

    it("Download", async () => {
        const dataHaste = await Hastebin.download(link);
        return expect(typeof dataHaste).toBe('object'); // Error
    });
});

describe('Pastie', () => {
    let link: any;
    it('Upload', async () => {
        const pastieLink = await Pastie.upload(text);
        link = pastieLink;
        return expect(pastieLink).toBeDefined();
    });
    it('Link is defined', () => {
        return expect(link).toBeDefined();
    });
    it("Download", async () => {
        const dataPastie = await Pastie.download(link);
        return expect(typeof dataPastie).toBe('object'); // Error
    });
});