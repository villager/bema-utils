/**
 * FS System
 *
 *  Based on https://github.com/smogon/pokemon-showdown/tree/master/lib/fs.ts
 * 
 * @dev Aldair Beltran
 *  
 * @license MIT
 */

/* eslint-disable */

import * as pathModule from 'path';
import * as fs from 'fs';


const ROOT_PATH = pathModule.resolve(__dirname, '..');

/*eslint no-unused-expressions: ["error", { "allowTernary": true }]*/

class FSPath {
	/**
	 * @param {string} path
	 */
	path: string;
	constructor(path) {
		this.path = pathModule.resolve(ROOT_PATH, path);
	}
	parentDir() {
		return new FSPath(pathModule.dirname(this.path));
	}
	async isFile() {
		return new Promise((resolve, reject) => {
			fs.stat(this.path, (err, stats) => {
				err ? reject(err) : resolve(stats.isFile());
			});
		});
	}

	isFileSync() {
		return fs.statSync(this.path).isFile();
	}

	async isDirectory() {
		return new Promise((resolve, reject) => {
			fs.stat(this.path, (err, stats) => {
				err ? reject(err) : resolve(stats.isDirectory());
			});
		});
	}

	isDirectorySync() {
		return fs.statSync(this.path).isDirectory();
	}
	read(/** @type {AnyObject | string} */ options = {}) {
		return new Promise((resolve, reject) => {
			fs.readFile(this.path, options, (err, data) => {
				err ? reject(err) : resolve(data);
			});
		});
	}
	readSync(/** @type {AnyObject | string} */ options = {}) {
		return fs.readFileSync(this.path, options);
	}
	/**
	 * @return {Promise<string>}
	 */
	readTextIfExists() {
		return new Promise((resolve, reject) => {
			fs.readFile(this.path, 'utf8', (err, data) => {
				if (err && err.code === 'ENOENT') return resolve('');
				err ? reject(err) : resolve(data);
			});
		});
	}
	readTextIfExistsSync() {
		try {
			return fs.readFileSync(this.path, 'utf8');
		} catch (err) {
			if (err.code !== 'ENOENT') throw err;
		}
		return '';
	}
	/**
	 * @param {string | Buffer} data
	 * @param {Object} options
	 */
	write(data, options = {}) {
		return new Promise((resolve, reject) => {
			fs.writeFile(this.path, data, options, err => {
				err ? reject(err) : resolve();
			});
		});
	}
	/**
	 * @param {string | Buffer} data
	 * @param {Object} options
	 */
	writeSync(data, options = {}) {
		return fs.writeFileSync(this.path, data, options);
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
	async safeWrite(data, options = {}) {
		/*eslint-disable no-use-before-define*/
		await FS(this.path + '.NEW').write(data, options);
		await FS(this.path + '.NEW').rename(this.path);
		/*eslint-enable no-use-before-define*/
	}
	/**
	 * @param {string | Buffer} data
	 * @param {Object} options
	 */
	safeWriteSync(data, options = {}) {
		/*eslint-disable no-use-before-define*/
		FS(this.path + '.NEW').writeSync(data, options);
		FS(this.path + '.NEW').renameSync(this.path);
		/*eslint-enable no-use-before-define*/
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
	append(data, options = {}) {
		return new Promise((resolve, reject) => {
			fs.appendFile(this.path, data, options, err => {
				err ? reject(err) : resolve();
			});
		});
	}
	/**
	 * @param {string | Buffer} data
	 * @param {Object} options
	 */
	appendSync(data, options = {}) {
		return fs.appendFileSync(this.path, data, options);
	}
	/**
	 * @param {string} target
	 */
	symlinkTo(target) {
		return new Promise((resolve, reject) => {
			// @ts-ignore TypeScript bug
			fs.symlink(target, this.path, err => {
				err ? reject(err) : resolve();
			});
		});
	}
	/**
	 * @param {string} target
	 */
	symlinkToSync(target) {
		return fs.symlinkSync(target, this.path);
	}
	/**
	 * @param {string} target
	 */
	rename(target) {
		return new Promise((resolve, reject) => {
			fs.rename(this.path, target, err => {
				err ? reject(err) : resolve();
			});
		});
	}
	/**
	 * @param {string} target
	 */
	renameSync(target) {
		return fs.renameSync(this.path, target);
	}
	readdir() {
		return new Promise((resolve, reject) => {
			fs.readdir(this.path, (err, data) => {
				err ? reject(err) : resolve(data);
			});
		});
	}
	readdirSync() {
		return fs.readdirSync(this.path);
	}
	/**
	 * @return {NodeJS.WritableStream}
	 */
	createWriteStream(options = {}) {
		return fs.createWriteStream(this.path, options);
	}
	/**
	 * @return {NodeJS.WritableStream}
	 */
	createAppendStream(options: AnyObject = {}) {
		options.flags = options.flags || 'a';
		return fs.createWriteStream(this.path, options);
	}
	unlinkIfExists() {
		return new Promise((resolve, reject) => {
			fs.unlink(this.path, err => {
				if (err && err.code === 'ENOENT') return resolve();
				err ? reject(err) : resolve();
			});
		});
	}
	unlinkIfExistsSync() {
		try {
			fs.unlinkSync(this.path);
		} catch (err) {
			if (err.code !== 'ENOENT') throw err;
		}
	}
	/**
	 * @param {string | number} mode
	 */
	mkdir(mode = 0o755) {
		return new Promise((resolve, reject) => {
			// @ts-ignore
			fs.mkdir(this.path, mode, err => {
				err ? reject(err) : resolve();
			});
		});
	}
	/**
	 * @param {string | number} mode
	 */
	mkdirSync(mode = 0o755) {
		// @ts-ignore
		return fs.mkdirSync(this.path, mode);
	}
	/**
	 * @param {string | number} mode
	 */
	mkdirIfNonexistent(mode = 0o755) {
		return new Promise((resolve, reject) => {
			// @ts-ignore
			fs.mkdir(this.path, mode, err => {
				if (err && err.code === 'EEXIST') return resolve();
				err ? reject(err) : resolve();
			});
		});
	}
	/**
	 * @param {string | number} mode
	 */
	mkdirIfNonexistentSync(mode = 0o755) {
		try {
			// @ts-ignore
			fs.mkdirSync(this.path, mode);
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
	onModify(callback) {
		fs.watchFile(this.path, (curr, prev) => {
			if (curr.mtime > prev.mtime) return callback();
		});
	}
	/**
	 * Clears callbacks added with onModify()
	 */
	unwatch() {
		fs.unwatchFile(this.path);
	}
}

/**
 * @param {string} path
 */
function getFs(path) {
	return new FSPath(path);
}

export const FS = Object.assign(getFs, {
	/**
	 * @type {Map<string, [Promise, (() => string | Buffer)?, Object]>}
	 */
	pendingUpdates: new Map(),
});

/* eslint-enable */