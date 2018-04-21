import { h, app } from 'hyperapp';
import {
    lensPath,
    view as lensView,
    over as lensOver,
    __,
    curryN,
} from 'ramda';

import {
    getCount as getCountOfSeeds,
    setCount as setCountOfSeeds,
    decrement as decrementSeeds,
} from './src/seeds';

import { title } from './src/components/title';

import { beforeNow } from './src/utils/beforeNow';

import { types } from './src/constants/types';
import { state } from './src/constants/state';
import { ONE_MINUTE, ONE_SECOND } from './src/constants/time';

const plantTypePath = type => lensPath(['plants', 'type', type]);
const harvestableTypePath = type => lensPath(['plants', 'harvestable', type]);

const getPlantByType = type => lensView(plantTypePath(type), __);
const setPlantByType = type => timestamp =>
    lensOver(plantTypePath(type), ps => ps.concat(timestamp), __);

const getHarvestableByType = type => lensView(harvestableTypePath(type), __);

const removeFromGrowing = curryN(3, (type, plants, s) =>
    lensOver(
        plantTypePath(type),
        ps => ps.filter(p => plants.indexOf(p) === -1),
        s,
    ),
);

const getReadyToHarvestByType = curryN(2, (type, s) =>
    lensView(harvestableTypePath(type), s).filter(beforeNow),
);

const countReadyToHarvestByType = curryN(
    2,
    (type, s) => getReadyToHarvestByType(type, s).length,
);

const addToHarvestable = curryN(3, (type, plants, s) =>
    lensOver(
        harvestableTypePath(type),
        ps => ps.concat(plants.map(p => p + ONE_MINUTE)),
        s,
    ),
);

const removeFromHarvestable = curryN(3, (type, plants, s) => {
    lensOver(
        harvestableTypePath(type),
        ps => ps.filter(p => plants.indexOf(p) === -1),
        s,
    );
});

const actions = {
    plant: type => s => {
        const setPlantAmount = setPlantByType(type);

        if (getCountOfSeeds(type, s) === 0) {
            return s;
        }

        return setPlantAmount(Date.now() + ONE_SECOND)(decrementSeeds(type, s));
    },

    readyToHarvest: ([type, plants]) => s =>
        addToHarvestable(type, plants)(removeFromGrowing(type, plants, s)),

    harvest: type => s =>
        removeFromHarvestable(
            type,
            getReadyToHarvestByType(type, s),
            setCountOfSeeds(type, countReadyToHarvestByType(type, s), s),
        ),

    getState: () => s => s,
};

const view = (s, a) =>
    h('div', {}, [
        title(s, a),
        h('div', {}, [
            h('p', {}, `plants: ${getPlantByType(types.standard)(s).length}`),
            h(
                'p',
                {},
                `ready to harvest: ${
                    getHarvestableByType(types.standard)(s).length
                }`,
            ),
        ]),
        h('button', { onclick: () => a.plant(types.standard) }, 'plant a seed'),
        h(
            'button',
            { onclick: () => a.harvest(types.standard) },
            'harvest a seed',
        ),
    ]);

const a = app(state, actions, view, document.body);

// Game Loop
setInterval(() => {
    const s = a.getState();
    const now = Date.now();

    const growing = getPlantByType(types.standard)(s);

    growing.forEach(g => {
        const left = g - now;

        console.log('time remaining:', left / 1000);
    });

    const done = growing.filter(then => then <= now);

    if (done.length > 0) {
        a.readyToHarvest([types.standard, done]);
    }
}, 1000);
