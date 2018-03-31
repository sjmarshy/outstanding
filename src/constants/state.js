import { types } from './types';

const state = {
    seeds: {
        type: {
            [types.standard]: 1,
        },
    },
    plants: {
        type: {
            [types.standard]: [],
        },
        harvestable: {
            [types.standard]: [],
        },
    },
};

export { state };
