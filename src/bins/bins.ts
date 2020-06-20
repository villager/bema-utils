/**
 * 
 * Bins Utility Plugin
 * 
 * @author Aldair Beltran
 * 
 */

const WHITE_LIST = ['https://hastebin.com', 'https://pastie.io'];

import {UtilNetwork as Net} from '../net/net';

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
            return await Net(url).get();
        } catch(e) {
            return e;
        }
	}
}

export const Pastie = new Bin(WHITE_LIST[1]);
export const Hastebin = new Bin(WHITE_LIST[0]);

export async function upload(toUpload: string) {
    try {
        return await Hastebin.upload(toUpload);
    } catch(e) {
        try {
            return await Pastie.upload(toUpload);
        } catch(e) {
            return e;
        }
    }
}
export async function download(key: string) {
    try {
        return await Hastebin.download(key);
    } catch(e) {
        try {
            return await Pastie.download(key);
        } catch(e) {
            return e;
        }
    }
}