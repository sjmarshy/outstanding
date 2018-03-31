import test from 'ava';

import { totalSeeds } from './';

test('counts the seeds', t => {
    const input = {
        seeds: {
            type: {
                a: 0,
                b: 1,
                c: 18,
            },
        },
    };

    const expected = 19;
    const actual = totalSeeds(input);

    t.is(actual, expected);
});
