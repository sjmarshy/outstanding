import { h, app } from 'hyperapp';

import { SeedBin, SeedStorage } from './src/seeds';

import { title } from './src/components/title';

import { beforeNow } from './src/utils/beforeNow';

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

    harvest: (type: string) => (s: typeof state): typeof state => {
        const { field, seeds } = s.field.harvest();
        return Object.assign({}, s, {
            seeds: s.seeds.merge(seeds),
            field,
        });
    },

    getState: () => (s): typeof state => s,

    time: {
        ping: () => (t: Timer) => {
            return t.ping();
        },
    },
};

const view = (s: typeof state, a) =>
    h('div', {}, [
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

const a: typeof actions = app(state, actions, view, document.body);

// Game Loop
setInterval(() => {
    a.time.ping();

    console.dir(a.getState());
}, 1000);
