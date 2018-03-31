import { h, app } from 'hyperapp';

const state = {
    seeds: 1,
    plants: 0
}

const actions = {
    plant: value => state => ({ seeds: state.seeds - 1, plants: state.plants + 1 })
}

const view = (s, a) => (
    h("div", {}, h("h1", {}, `Outstanding: A Tale of ${s.seeds} Seeds`))
)

app(state, actions, view, document.body);