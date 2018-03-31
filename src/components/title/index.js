import { h } from 'hyperapp';

const title = s =>
    h(
        'h1',
        {},

        `Outstanding: A Tale of ${
            s.seeds === 1 ? 'a Seed' : `${s.seeds} Seeds`
        }`,
    );

export { title };
