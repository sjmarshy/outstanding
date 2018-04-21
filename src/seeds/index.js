import { lensPath, view, set, over, curryN, compose } from 'ramda';

const inc = n => n + 1;
const dec = n => n - 1;

export const path = type => ['seeds', 'type', type];
export const lens = compose(lensPath, path);

export const getCount = curryN(2, (type, state) => view(lens(type), state));
export const setCount = curryN(3, (type, count, state) =>
    set(lens(type), count, state),
);

export const increment = curryN(2, (type, state) =>
    over(lens(type), inc, state),
);

export const decrement = curryN(2, (type, state) =>
    over(lens(type), dec, state),
);
