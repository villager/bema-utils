/**
 * 
 * Bins Utility Plugin
 * 
 * @author Aldair Beltran
 * 
 */

const WHITE_LIST = ['https://hastebin.com', 'https://pastie.io'];

import {UtilNetwork as Net} from '../net';

export class Bin {
    url: string;
	constructor(url: string) {
		this.url = url;
	}
	async upload(toUpload: string) {
        try {
            let chunk = await Net(this.url).request({
                path: '/documents',
                data: toUpload,
            }) as string;
            try {
                let linkStr = this.url + '/' + JSON.parse(chunk.toString())['key'];
                return linkStr;
            } catch(e) {
                return e;
            }

        } catch(e) {
            return e;
        }
	}
	async download(key: string) {
        let url = this.url + key;
        try {
            let data = await Net(url).get();
            return data;
        } catch(e) {
            return e;
        }
	}
}

export const Pastie = new Bin(WHITE_LIST[1]);
export const Hastebin = new Bin(WHITE_LIST[0]);

export async function upload(toUpload: string) {
    try {
        let hasteLink = await Hastebin.upload(toUpload);
        return hasteLink;
    } catch(e) {
        try {
            let pastieLink = await Pastie.upload(toUpload);
            return pastieLink;
        } catch(e) {
            return e;
        }
    }
}
export async function download(key: string) {
    try {
        let hastieDownload = await Hastebin.download(key);
        return hastieDownload;
    } catch(e) {
        try {
            let pastieDownload = await Pastie.download(key);
            return pastieDownload;
        } catch(e) {
            return e;
        }
    }
}