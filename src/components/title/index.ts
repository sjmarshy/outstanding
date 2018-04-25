import { h } from 'hyperapp';

import classNames from './index.css';
import { state } from '../../constants/state';

const title = (s: typeof state) =>
    h(
        'h1',
        { class: classNames.title },

        `Outstanding: A Tale of ${
            s.seeds.countAll() === 1 ? 'a Seed' : `${s.seeds.countAll()} Seeds`
        }`,
    );

export { title };
