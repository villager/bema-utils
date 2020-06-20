/***
 * Test Bin's Utility
 */

import {Hastebin, Pastie} from '../src/bins/bins';


let text = 'This is a test';

describe("Hastebin", () => {
    let link: string;
    it("Upload", async () => {
        let hasteLink = await Hastebin.upload(text);
        link = hasteLink;
        return expect(hasteLink).toBeDefined();
    });
    
    it("Link is defined", () => {
        return expect(link).toBeDefined();
    });
    
    it("Download", async () => {
        let dataHaste = await Hastebin.download(link.split('/')[1]);
        return expect(typeof dataHaste).toBe('string');
    });
});

describe('Pastie', () => {
    let link: string;
    it('Upload', async () => {
        let pastieLink = await Pastie.upload(text);
        link = pastieLink;
        return expect(pastieLink).toBeDefined();
    });
    it('Link is defined', () => {
        return expect(link).toBeDefined();
    });
    it("Download", async () => {
        let dataPastie = await Pastie.download(link.split('/')[1]);
        return expect(typeof dataPastie).toBe('string');
    });
});