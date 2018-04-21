import test from 'ava';

import { view } from 'ramda';

import { path, lens, getCount, setCount, increment, decrement } from './';

const makeState = (type, count) => ({
    seeds: {
        type: {
            [type]: count,
            other: 12,
        },
    },
});

test('path returns the expected lens given the type', t => {
    const type = 'lol';
    const expected = ['seeds', 'type', type];
    const actual = path(type);

    t.deepEqual(actual, expected);
});

test('lens', t => {
    const type = 'blackberry';
    const state = makeState(type, 12);

    const expected = 12;
    const actual = view(lens(type), state);

    t.is(actual, expected);
});

test('getCount', t => {
    const type = 'test';
    const state = makeState(type, 8);

    const expected = 8;
    const actual = getCount(type, state);

    t.is(actual, expected);
});

test('setCount', t => {
    const type = 'goose';
    const state = makeState(type, 10000);

    const expected = makeState(type, 8);
    const actual = setCount(type, 8, state);

    t.deepEqual(actual, expected);
});

test('increment', t => {
    const type = 'narp';
    const state = makeState(type, 1);

    const expected = makeState(type, 2);
    const actual = increment(type, state);

    t.deepEqual(actual, expected);
});

test('decrement', t => {
    const type = 'pran';
    const state = makeState(type, 2);

    const expected = makeState(type, 1);
    const actual = decrement(type, state);

    t.deepEqual(actual, expected);
});
