import { h, app } from 'hyperapp';
import { lensPath, view as lensView, set as lensSet, __ } from 'ramda';

import { title } from './src/components/title';

import { types } from './src/constants/types';
import { state } from './src/constants/state';

const seedTypePath = type => lensPath(['seeds', 'type', type]);
const plantTypePath = type => lensPath(['plants', 'type', type]);

const getSeedByType = type => lensView(seedTypePath(type), __);
const setSeedByType = type => value => lensSet(seedTypePath(type), value, __);

const getPlantByType = type => lensView(plantTypePath(type), __);
const setPlantByType = type => value => lensSet(plantTypePath(type), value, __);

const actions = {
    plant: type => s => {
        const getSeedAmount = getSeedByType(type);
        const setSeedAmount = setSeedByType(type);
        const getPlantAmount = getPlantByType(type);
        const setPlantAmount = setPlantByType(type);

        const seedAmount = getSeedAmount(s);

        if (seedAmount === 0) {
            return s;
        }

        return setPlantAmount(getPlantAmount(s) + 1)(
            setSeedAmount(getSeedAmount(s) - 1)(s),
        );
    },
};

const view = (s, a) =>
    h('div', {}, [
        title(s, a),
        h('div', {}, [
            h('p', {}, `plants: ${getPlantByType(types.standard)(s)}`),
        ]),
        h('button', { onclick: () => a.plant(types.standard) }, 'plant a seed'),
    ]);

app(state, actions, view, document.body);
