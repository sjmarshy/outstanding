import { h, app } from 'hyperapp';
import { title } from './src/components/title';

const state = {
    seeds: 1,
    plants: 0,
};

const actions = {
    plant: () => s => ({
        seeds: s.seeds - 1,
        plants: s.plants + 1,
    }),
};

const view = (s, a) => h('div', {}, title(s, a));

app(state, actions, view, document.body);
