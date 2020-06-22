/**
 * Testing event emit
 */
import {EventEmitter} from '../../../src/events';

import * as assert from 'assert';

const e = new EventEmitter();

 // eslint-disable-line
  e.on('eventOne', function (this: any) {
 // eslint-disable-line
    this.data('key', 42);
});
e.emit('eventOne');
describe('Events Emit', () => {
    it('data', function () {
        expect(e._data['key']).toEqual(42);
        expect(e.data('key')).toEqual(e._data['key']);
        e.flush();

        e.on('eventTwo', function (this: any) {
            this.data('key2', 7);
        });
        e.emit('eventTwo');
        
        expect(e._data['key']).toBe(undefined);
        expect(e.data('key')).toBe(undefined);
        expect(e._data['key2']).toEqual(7);
        expect(e.data('key2')).toEqual(7);

        e.flush();
        expect(e._data).toStrictEqual(null);
        expect(e._stack.length).toStrictEqual(1);
        e.on('childEventOne', function (this: any) {
            expect(e._data['key2'] !== 7).toBe(true);
            expect(e._data['key2'] !== 8).toBe(true);
            this.data('key2', 7);
            expect(e._data['key2']).toEqual(7);
        });
        
        e.on('parentEventOne', function (this: any) {
            expect(e._data['key2'] !== 8).toBe(true);
            this.data('key2', 8);
            expect(e._data['key2']).toEqual(8);
            e.emit('childEventOne');
            expect(e._data['key2']).toEqual(7);
            e.flush();
        });
        
        e.emit('parentEventOne');
        expect(e._data['key2']).toEqual(8);
        e.flush();
        expect(e._data).toStrictEqual(null);
        expect(e._stack.length).toStrictEqual(1);
        
        e.on('complexEventOne', function (this: any) {
            this.data('key', 'value1');
        });
        e.on('complexEventOne', function (this: any) {
            this.data('key', 'value2');
        });
        e.emit('complexEventOne', 1, 2, 3, 4, 5);
        expect(e._data['key']).toEqual('value2');
        expect(e.data('key')).toEqual('value2');
        
        expect(e._stack.length).toBe(2);
        e.flush();
        
        expect(e._data).toStrictEqual(null);
        expect(e._stack.length).toStrictEqual(1);
        
        /* Failing test !! */
        e.on('subEventOne', function () {});
        e.on('subEventTwo', function (this: any) {
            this.data('DataEntry', 'some_fancy_data');
        });
        
        e.on('complexEventTwo', function () {
            const data = e._data;
        
            e.emit('subEventOne');
            expect(data).toStrictEqual(e._data);
            e.flush();
            expect(data).toStrictEqual(e._data);
        
            e.emit('subEventTwo');
    
            assert.notStrictEqual(data, e._data);
        
            const retrievedData = e.getData().DataEntry;
            expect(retrievedData).toStrictEqual('some_fancy_data');
            expect(data).toStrictEqual(e._data);
        
            e.data('dataEntry', 42);
            expect(data).toEqual(e._data);
            e.data('DataEntry', 43);
            expect(data).toEqual(e._data);
        
            assert.notStrictEqual(e.data('dataEntry'), e.data('DataEntry'));
            expect(e._stack.length).toStrictEqual(2);
        });
        
        e.emit('complexEventTwo');
        expect(e.data('DataEntry')).toStrictEqual(43);
        expect(e._stack.length).toStrictEqual(2);
        e.flush();
        expect(e._stack.length).toStrictEqual(1);
        
        assert.throws(e.data.bind(e, 'customKey'));
        assert.throws(e.data.bind(e, 'customKey', 7));
    });
});