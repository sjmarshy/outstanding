import { types } from './types';

const state = {
    seeds: {
        type: {
            [types.standard]: 1,
        },
    },
    plants: {
        type: {
            // array of timestamps
            [types.standard]: [],
        },
        harvestable: {
            // array of timestamps
            [types.standard]: [],
        },
    },
};

export { state };
