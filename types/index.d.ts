

interface AnyObject {
    [k: string]: any;
}
import {UtilSet as SetType} from "../src/set/set";
import {UtilMap as MapType} from '../src/map/map';
import {FS as FSType} from '../src/fs/fs';
import {EloRank as EloType} from '../src/elo/elo';
import {upload as upType,
    download as downType,
    Bin as BinType,
    Hastebin as HasteType,
    Pastie as PastieType,
} from '../src/bins/bins';
import {Package as PackageType} from '../src/package/package';
import {UtilNetwork as NetType, Net as NetworkType} from '../src/net/net';

declare module 'bema-utils' {
    export const Set: typeof SetType;
    export const Map: typeof MapType;
    export const FS: typeof FSType;
    export const Elo: typeof EloType;
    namespace Bins {
        export const upload: typeof upType;
        export const download: typeof downType;
        export const Bin: typeof BinType;
        export const Hastebin: typeof HasteType;
        export const Pastie: typeof PastieType;
    }
    export const Package: typeof PackageType;
    export const Network: typeof NetworkType;
    export const Net: typeof NetType;

}