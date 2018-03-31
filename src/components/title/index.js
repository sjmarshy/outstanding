import { h } from 'hyperapp';
import { totalSeeds } from '../../utils/totalSeeds';

import classNames from './index.css';

const title = s =>
    h(
        'h1',
        { class: classNames.title },

        `Outstanding: A Tale of ${
            totalSeeds(s) === 1 ? 'a Seed' : `${totalSeeds(s)} Seeds`
        }`,
    );

export { title };
