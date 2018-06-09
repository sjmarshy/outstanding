import { types } from './types';
import { SeedBin } from '../seeds/SeedBin';
import { SeedStorage } from '../seeds/SeedStorage';
import { Field } from '../field';

export class Timer {
    constructor(private time: number = 0) {}
    ping(): Timer {
        return new Timer(this.time + 1);
    }
    value(): number {
        return this.time;
    }
}

const state = {
    time: new Timer(),
    seeds: new SeedStorage([new SeedBin(types.standard, 1)]),
    field: new Field(),
};

export { state };
