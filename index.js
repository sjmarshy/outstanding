import { h, app } from 'hyperapp';
import {
    lensPath,
    view as lensView,
    set as lensSet,
    over as lensOver,
    __,
} from 'ramda';

import { title } from './src/components/title';

import { types } from './src/constants/types';
import { state } from './src/constants/state';

const ONE_SECOND = 1 * 1000;
const ONE_MINUTE = 60 * ONE_SECOND;

const seedTypePath = type => lensPath(['seeds', 'type', type]);
const plantTypePath = type => lensPath(['plants', 'type', type]);
const harvestableTypePath = type => lensPath(['plants', 'harvestable', type]);

const getSeedByType = type => lensView(seedTypePath(type), __);
const setSeedByType = type => value => lensSet(seedTypePath(type), value, __);

const getPlantByType = type => lensView(plantTypePath(type), __);
const setPlantByType = type => value =>
    lensOver(plantTypePath(type), ps => ps.concat(value), __);

const getHarvestableByType = type => lensView(harvestableTypePath(type), __);

const removeFromGrowing = (type, plants) => s =>
    lensOver(
        plantTypePath(type),
        ps => ps.filter(p => plants.indexOf(p) === -1),
        s,
    );

const addToHarvestable = (type, plants) => s =>
    lensOver(
        harvestableTypePath(type),
        ps => ps.concat(plants.map(p => p + ONE_MINUTE)),
        s,
    );

const actions = {
    plant: type => s => {
        const getSeedAmount = getSeedByType(type);
        const setSeedAmount = setSeedByType(type);
        const setPlantAmount = setPlantByType(type);

        const seedAmount = getSeedAmount(s);

        if (seedAmount === 0) {
            return s;
        }

        return setPlantAmount(Date.now() + ONE_SECOND)(
            setSeedAmount(getSeedAmount(s) - 1)(s),
        );
    },

    readyToHarvest: ([type, plants]) => s =>
        addToHarvestable(type, plants)(removeFromGrowing(type, plants)(s)),

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
