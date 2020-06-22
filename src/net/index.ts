/***
 *
 * Network Utility functions
 *
 * @author Aldair Beltran
 *
 */

import * as https from 'https';
import * as http from 'http';
import * as url from 'url';

export const description = 'Easy way to do request from some http/s page';

interface AnyObject {
	[k: string]: any;
}
export class Net {
	url: string;
	readonly protocol: string;
	constructor(uri: string) {
		this.url = uri;
		this.protocol = url.parse(this.url).protocol as string;
	}
	get(): Promise<string|any> {
		const net = this.protocol === 'https:' ? https : http;
		return new Promise((resolve, reject) => {
			net.get(this.url, (res: any) => {
				res.setEncoding('utf8');
				let data = '';
				res.on('data', (chunk: string) => {
					data += chunk;
				});
				res.on('end', () => {
					resolve(data as string);
				});
				res.on('error', (err: any) => {
					reject(err);
				});
			})
				.on('error', (err: any) => {
					reject(err);
				})
				.setTimeout(3500);
		});
	}
	async toJSON() {
		try {
			const data = await this.get();
			return JSON.parse(data);
		} catch (e) {
			return e;
		}
	}
	request(opts: AnyObject) {
		const net = this.protocol === 'https:' ? https : http;
		const actionUrl = url.parse(this.url);
		const hostname = actionUrl.hostname;
		const options: AnyObject = {
			hostname: hostname,
			method: 'POST',
		};
		// eslint-disable-next-line
		for (let i in opts) {
			options[i] = opts[i];
		}
		if (options.data) delete options.data;
		if (!options.hostname) options.hostname = hostname;
		return new Promise((resolve, reject) => {
			let str = '';
			const req = net.request(options, (res: any) => {
				res.setEncoding('utf8');
				res.on('data', (chunk: string) => {
					str += chunk;
				});
				res.on('end', () => {
					resolve(str);
				});
			});
			req.on('error', (e: any) => {
				reject(e);
			});
			if (opts.data) req.write(opts.data);
			req.end();
		});
	}
}
export function UtilNetwork(uri: string) {
	return new Net(uri);
}