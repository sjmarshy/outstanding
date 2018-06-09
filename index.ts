import { h, app } from 'hyperapp';

import { SeedBin } from './src/seeds/SeedBin';
import { SeedStorage } from './src/seeds/SeedStorage';

import { title } from './src/components/title';

import { types } from './src/constants/types';
import { state, Timer } from './src/constants/state';
import { ONE_MINUTE, ONE_SECOND } from './src/constants/time';
import { none, Option, some } from 'fp-ts/lib/Option';

function notZero(opt: Option<number>): Option<number> {
    return opt.chain(num => (num === 0 ? none : some(num)));
}

const actions = {
    plant: (type: string) => (s: typeof state): typeof state => {
        return Object.assign({}, s, {
            seeds: notZero(s.seeds.count(type))
                .map(() => s.seeds.pluck(type, 1))
                .getOrElse(s.seeds),
            field: notZero(s.seeds.count(type))
                .map(() => s.field.sew(type))
                .getOrElse(s.field),
        });
    },

    harvest: (type: string) => (s: typeof state) => {
        const harvest = s.field.harvest();
        return Object.assign({}, s, {
            seeds: s.seeds.merge(harvest.extractSeeds()),
            field: harvest.getField(),
        });
    },

    getState: () => (s: typeof state) => s,

    time: {
        ping: () => (t: Timer) => {
            console.log('ping');
            return t.ping();
        },
    },
};

const view = (s: typeof state, a: typeof actions) => {
    console.log(s.time instanceof Timer);
    return h('div', {}, [
        title(s),
        h('section', {}, h('p', {}, `time ${s.time.value()}`)),
        h('div', {}, [
            h('p', {}, `plants: ${s.field.countGrowing()}`),
            h('p', {}, `ready to harvest: ${s.field.countGrown()}`),
        ]),
        h('button', { onclick: () => a.plant(types.standard) }, 'plant a seed'),
        h(
            'button',
            { onclick: () => a.harvest(types.standard) },
            'harvest a seed',
        ),
    ]);
};

const a: typeof actions = app(state, actions, view, document.body);

// Game Loop
setTimeout(() => {
    console.dir(a.getState());
    a.time.ping();
}, 1000);
