
import * as assert from 'assert';

import {EventEmitter} from '../../../src/events';


const e = new EventEmitter();

describe('Events Env', () => {
    it('eventOne', () => {
        e.on('eventOne', function(this: any) {
            this.env('key', 42);
        })
        e.emit('eventOne');
        expect(e._data._env['key']).toEqual(42);
        expect(e.env('key')).toEqual(42);
        e.flush();
    })
    it('Throws', () => {
        assert.throws(e.env.bind(e, 'key'), Error);
        assert.throws(function () {
            e._data._env['key'];
        }, Error);
        assert.throws(function () {
            e._data._env;
        }, Error);
    
        assert.throws(e.flush.bind(e));
    });
    it('EventTwo', () => {
        e.on('eventTwo', function (this: any) {
            this.env('key2', 7);
        });
        e.emit('eventTwo');
        expect(e._data._env['key']).toEqual(undefined);
        expect(e.env('key')).toEqual(undefined);
        expect(e._data._env['key2']).toEqual(7);
        expect(e.env('key2')).toEqual(7);
        e.flush();
    });
    it('Throws env', () => {
        assert.throws(e.env.bind(e, 'key'), Error);
        assert.throws(e.env.bind(e, 'key2'), Error);
        assert.throws(function () {
            e._data._env['key'];
        }, Error);
        assert.throws(function () {
            e._data._env['key2'];
        }, Error);
        assert.throws(function () {
            e._data._env;
        }, Error);
    });
});