
import {FS} from '../fs';

interface AnyObject {
    [k: string]: any;
}
export class Package {
    file: string;
    data: AnyObject;
    constructor(file?: string) {
        if (!file) {
            this.file = './';
        } else {
            this.file = `${file}${file.endsWith('/') ? '' : '/'}`;
		}
		this.file += 'package.json';
        this.data = {};
	}
	getData() {
		if (this.exists) {
			return JSON.parse(FS(this.file).readExistsSync());
		} else {
			return JSON.parse('{}');
		}
	}
	get name(): string {
		const pathName = this.file.split('/');
		return pathName[pathName.length - 2];
	}
    creator(data: AnyObject): void {
        if (typeof data !== 'object') throw Error('Unacceptable data type');
		Object.assign(this.data, data);
		if (this.data.main) {
			delete this.data.main;
		}
		if (this.data.name) {
			delete this.data.name;
		}
		this.data.main = this.name;
		this.data.name = this.name;
		const toSave = JSON.stringify(this.data);
        FS(this.file).writeSync(toSave);
    }
    get exists(): boolean {
		try {
            return FS(this.file).isFileSync();
		} catch (e) {
			return false;
		}
    }
    remove() {
        try {
            FS(this.file).unlinkIfExistsSync();
            return true;
        } catch (e) {
            return false;
        }
    }
}