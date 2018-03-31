import { h, app } from 'hyperapp';
import { title } from './src/components/title';
import { types } from './src/constants/types';
import { state } from './src/constants/state';

const actions = {
    plant: type => s => ({
        seeds: s.seeds.type[type] - 1,
        plants: s.plants.type[type] + 1,
    }),
};

const view = (s, a) =>
    h('div', {}, [
        title(s, a),
        h('button', { onClick: () => a.plant(types.standard) }, 'plant'),
    ]);

app(state, actions, view, document.body);
