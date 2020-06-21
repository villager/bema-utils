/**
 * Main File
 */


import {UtilNetwork, Net as UtilNet} from './net/net';
import {UtilSet} from './set/set';
import {UtilMap} from './map/map';
import * as BinsPages from './bins/bins';
import {Package as UtilPackage} from './package/package';
import {FS as UtilFS} from './fs/fs';
import {EloRank} from './elo/elo';
import {Builder as UtilBuilder} from '../builder.js';

export const Net = UtilNetwork;
export const Network = UtilNet;
export const Set = UtilSet;
export const Map = UtilMap;
export const Bins = BinsPages;
export const Package = UtilPackage;
export const FS = UtilFS;
export const Elo = EloRank;
export const Builder = UtilBuilder;