/**
 * Utility Set Extension
 *
 * @author Aldair Beltran
 */

export class UtilSet extends Set {
    toJSON(): any[] {
        return Array.from(this);
    }

    get length(): number {
        return this.size;
    }

    merge(toAssign: any): void {
        if (Array.isArray(toAssign)) {
            for (const task of toAssign) {
                this.add(task);
            }
        } else if (typeof toAssign === 'string') {
            this.add(toAssign);
        } else if (typeof toAssign === 'object') {
            for (const i in toAssign) {
                this.add(i); // Just save keys
            }
        } else {
            this.add(toAssign);
        }
    }
    remove(key: any): void{
        this.delete(key);
    }
    difference(data: any): any[] {
        if (Array.isArray(data)) {
            for (const i of data) {
                if (this.has(i)) {
                    this.remove(i);
                }
            }
        } else if (typeof data === 'object') {
            for (const i in data) {
                if (this.has(i)) {
                    this.remove(i);
                }
            }
        } else {
            if (this.has(data)) {
                this.remove(data);
            }
        }
        return this.toJSON();
    }

    intersection(data: any): any[] {
        const list = this.toJSON();
        if (Array.isArray(data)) {
            data = new UtilSet(data);
            list.filter(x => {
                data.has(x);
            });
        } else if (typeof data === 'object') {
            data = new UtilSet(Object.values(data));
            list.filter(x => {
                data.has(x);
            });
        } else {
            throw Error('Invalid arg');
        }
        return list;
    }
    difSync(data: any): any[] {
        this.union(data);
        this.dif(data);
        return this.toJSON();
    }

	union(data: any): void{
		return this.merge(data);
    }

	dif(data: any): any[] {
		return this.difference(data);
    }
    inter(data: any): any[] {
        return this.intersection(data);
    }
}