/**
 * FS System
 *
 *  Based on https://github.com/smogon/pokemon-showdown/tree/master/lib/fs.ts
 *
 * @dev Aldair Beltran
 *
 * @license MIT
 */

import * as PATH_MODULE from 'path';
import * as FILE_SYSTEM from 'fs';
import {promises as FILE_PROMISE} from 'fs';


const ROOT_PATH = PATH_MODULE.resolve(__dirname, '../..');

interface AnyObject {
    [k: string]: any;
}
type StringBuf = string | Buffer;

/* eslint no-unused-expressions: ["error", { "allowTernary": true }]*/

class FSPath {
	/**
	 * @param {string} path
	 */
	path: string;
	constructor(path: string) {
		this.path = PATH_MODULE.resolve(ROOT_PATH, path);
	}
	parentDir() {
		return new FSPath(PATH_MODULE.dirname(this.path));
	}
	async isFile() {
        try {
            return (await this.stat()).isFile();
        } catch (e) {
            return e;
        }
	}
    async stat() {
        try {
            return await FILE_PROMISE.stat(this.path);
        } catch (e) {
            return e;
        }
    }
    async isDirectory() {
        try {
            return (await this.stat()).isDirectory();
        } catch (e) {
            return e;
        }
	}
	isFileSync() {
		return FILE_SYSTEM.statSync(this.path).isFile();
	}

	isDirectorySync() {
		return FILE_SYSTEM.statSync(this.path).isDirectory();
	}
	async read(/** @type {AnyObject | string} */ options = {}) {
        try {
            return await FILE_PROMISE.readFile(this.path, options);
        } catch (e) {
            return e;
        }
	}
	readSync(/** @type {AnyObject | string} */ options: AnyObject = {}) {
		return FILE_SYSTEM.readFileSync(this.path, options);
	}
	/**
	 * @return {Promise<string>}
	 */
	async readExists() {
        try {
            return await FILE_PROMISE.readFile(this.path, 'utf-8');
        } catch (e) {
            if (e && e.code === 'ENOENT') return '';
            return e;
        }
	}
	readExistsSync() {
		try {
			return FILE_SYSTEM.readFileSync(this.path, 'utf8');
		} catch (err) {
			if (err.code !== 'ENOENT') throw err;
		}
		return '';
	}
	/**
	 * @param {string | Buffer} data
	 * @param {Object} options
	 */
	async write(data: StringBuf, options: AnyObject = {}) {
        try {
            return await FILE_PROMISE.writeFile(this.path, data, options);
        } catch (e) {
            return e;
        }
	}
	/**
	 * @param {string | Buffer} data
	 * @param {Object} options
	 */
	writeSync(data: StringBuf, options = {}) {
		return FILE_SYSTEM.writeFileSync(this.path, data, options);
	}
	/**
	 * Writes to a new file before renaming to replace an old file. If
	 * the process crashes while writing, the old file won't be lost.
	 * Does not protect against simultaneous writing; use writeUpdate
	 * for that.
	 *
	 * @param {string | Buffer} data
	 * @param {Object} options
	 */
	async safeWrite(data: StringBuf, options = {}) {
		/* eslint-disable no-use-before-define*/
		await FS(this.path + '.NEW').write(data, options);
		await FS(this.path + '.NEW').rename(this.path);
		/* eslint-enable no-use-before-define*/
	}
	/**
	 * @param {string | Buffer} data
	 * @param {Object} options
	 */
	safeWriteSync(data: StringBuf, options = {}) {
		/* eslint-disable no-use-before-define*/
		FS(this.path + '.NEW').writeSync(data, options);
		FS(this.path + '.NEW').renameSync(this.path);
		/* eslint-enable no-use-before-define*/
	}
	/**
	 * Safest way to update a file with in-memory state. Pass a callback
	 * that fetches the data to be written. It will write an update,
	 * avoiding race conditions. The callback may not necessarily be
	 * called, if `writeUpdate` is called many times in a short period.
	 *
	 * `options.throttle`, if it exists, will make sure updates are not
	 * written more than once every `options.throttle` milliseconds.
	 *
	 * No synchronous version because there's no risk of race conditions
	 * with synchronous code; just use `safeWriteSync`.
	 *
	 * DO NOT do anything with the returned Promise; it's not meaningful.
	 *
	 * @param {() => string | Buffer} dataFetcher
	 * @param {Object} options
	 */
	async writeUpdate(dataFetcher: any, options?: any) {
		const pendingUpdate = FS.pendingUpdates.get(this.path);
		if (pendingUpdate) {
			pendingUpdate[1] = dataFetcher;
			pendingUpdate[2] = options;
			return;
		}
		let pendingFetcher = /** @type {(() => string | Buffer)?} */ dataFetcher;
		while (pendingFetcher) {
			let updatePromise = this.safeWrite(pendingFetcher(), options);
			FS.pendingUpdates.set(this.path, [updatePromise, null, options]);
			await updatePromise;
			if (options.throttle) {
				await new Promise(resolve => setTimeout(resolve, options.throttle));
			}
			if (!pendingUpdate) return;
			[updatePromise, pendingFetcher, options] = pendingUpdate;
		}
		FS.pendingUpdates.delete(this.path);
	}
	/**
	 * @param {string | Buffer} data
	 * @param {Object} options
	 */
	async append(data: StringBuf, options = {}) {
        try {
            return await FILE_PROMISE.appendFile(this.path, data, options);
        } catch (e) {
            return e;
        }
	}
	/**
	 * @param {string | Buffer} data
	 * @param {Object} options
	 */
	appendSync(data: StringBuf, options = {}) {
		return FILE_SYSTEM.appendFileSync(this.path, data, options);
	}
	/**
	 * @param {string} target
	 */
	async symlinkTo(target: string) {
        try {
            return await FILE_PROMISE.symlink(target, this.path);
        } catch (e) {
            return e;
        }
	}
	/**
	 * @param {string} target
	 */
	symlinkToSync(target: string) {
		return FILE_SYSTEM.symlinkSync(target, this.path);
	}
	/**
	 * @param {string} target
	 */
	async rename(target: string) {
        try {
            return await FILE_PROMISE.rename(this.path, target);
        } catch (e) {
            return e;
        }
	}
	/**
	 * @param {string} target
	 */
	renameSync(target: string) {
		return FILE_SYSTEM.renameSync(this.path, target);
	}
	async readdir() {
        try {
            return await FILE_PROMISE.readdir(this.path);
        } catch (e) {
            return e;
        }
	}
	readdirSync() {
		return FILE_SYSTEM.readdirSync(this.path);
	}
	/**
	 * @return {NodeJS.WritableStream}
	 */
	createWriteStream(options = {}) {
		return FILE_SYSTEM.createWriteStream(this.path, options);
	}
	/**
	 * @return {NodeJS.WritableStream}
	 */
	createAppendStream(options: AnyObject = {}) {
		options.flags = options.flags || 'a';
		return FILE_SYSTEM.createWriteStream(this.path, options);
	}
	async unlinkIfExists() {
        try {
            return await FILE_PROMISE.unlink(this.path);
        } catch (e) {
            if (e.code === 'ENOENT') return '';
            return e;
        }
	}
	unlinkIfExistsSync() {
		try {
			FILE_SYSTEM.unlinkSync(this.path);
		} catch (err) {
			if (err.code !== 'ENOENT') throw err;
		}
	}
	/**
	 * @param {string | number} mode
	 */
	async mkdir(mode = 0o755) {
        try {
            return await FILE_PROMISE.mkdir(this.path, mode);
        } catch (e) {
            return e;
        }
	}
	/**
	 * @param {string | number} mode
	 */
	mkdirSync(mode = 0o755) {
		return FILE_SYSTEM.mkdirSync(this.path, mode);
	}
	/**
	 * @param {string | number} mode
	 */
	async mkdirIfNonexistent(mode = 0o755) {
        try {
            return await FILE_PROMISE.mkdir(this.path, mode);
        } catch (e) {
            if (e.code === 'EEXIST') return '';
            return e;
        }
	}
	/**
	 * @param {string | number} mode
	 */
	mkdirIfNonexistentSync(mode = 0o755) {
		try {
			FILE_SYSTEM.mkdirSync(this.path, mode);
		} catch (err) {
			if (err.code !== 'EEXIST') throw err;
		}
	}
	/**
	 * Creates the directory (and any parent directories if necessary).
	 * Does not throw if the directory already exists.
	 * @param {string | number} mode
	 */
	async mkdirp(mode = 0o755) {
		try {
			await this.mkdirIfNonexistent(mode);
		} catch (err) {
			if (err.code !== 'ENOENT') throw err;
			await this.parentDir().mkdirp(mode);
			await this.mkdirIfNonexistent(mode);
		}
	}
	/**
	 * Creates the directory (and any parent directories if necessary).
	 * Does not throw if the directory already exists. Synchronous.
	 * @param {string | number} mode
	 */
	mkdirpSync(mode = 0o755) {
		try {
			this.mkdirIfNonexistentSync(mode);
		} catch (err) {
			if (err.code !== 'ENOENT') throw err;
			this.parentDir().mkdirpSync(mode);
			this.mkdirIfNonexistentSync(mode);
		}
	}
	/**
	 * Calls the callback if the file is modified.
	 * @param {function (): void} callback
	 */
	onModify(callback: any) {
		FILE_SYSTEM.watchFile(this.path, (curr, prev) => {
			if (curr.mtime > prev.mtime) return callback();
		});
	}
	/**
	 * Clears callbacks added with onModify()
	 */
	unwatch() {
		FILE_SYSTEM.unwatchFile(this.path);
	}
}

/**
 * @param {string} path
 */
function getFs(path: string) {
	return new FSPath(path);
}

export const FS = Object.assign(getFs, {
	/**
	 * @type {Map<string, [Promise, (() => string | Buffer)?, Object]>}
	 */
	pendingUpdates: new Map(),
});