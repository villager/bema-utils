/**
 * Command Runner
 */


const child_process = require('child_process');
const {promises} = require('fs');
const fs = promises;
const path = require('path');

const Builder = new class {
    run(cmd) {
        return new Promise((resolve, reject) => {
            try {
                child_process.execSync(cmd, {stdio: 'inherit', cwd: __dirname});
                resolve();
            } catch (e) {
                reject(new Error(`command failed "${cmd}"`));
            }
        });
    }
    async copyPath(origin, dest) {
        let data = await fs.readFile(origin);
        return await fs.writeFile(dest, data);
    }
    async readdir(file) {
        return await fs.readdir(file);
    }
    async copyDir(origin, dest, exept) {
        let exeptionList = new Set(exept || []);
        fs.lstat(origin).then(stats => {
            if (stats.isSymbolicLink()) return;
            if (stats.isFile()) {
                if (!exeptionList.has(path.extname(origin))) this.copyPath(origin, dest);
            } else if (stats.isDirectory()) {
                this.readdir(origin).then(files => {
                    for (const file of files) {
                        this.copyDir(path.join(origin, file), path.join(dest, file));
                    }
                }).catch(e => {
                    throw e;
                });
            }
        }).catch(error => {
            throw error;
        });
    }
    async sucrase(src, out, opts) {
        try {
            await this.run(`npx sucrase ${opts || ''} -q ${src} -d ${out} --transforms typescript,imports --enable-legacy-typescript-module-interop`);
            return true;
        } catch (e) {
            return e;
        }
    }
}();
exports.Builder = Builder;