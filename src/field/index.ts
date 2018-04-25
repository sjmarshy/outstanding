import { SeedStorage, SeedBin } from '../seeds';

export class GrowSchedule {
    constructor(private _start: number) {}

    public isComplete(current: number) {
        return current >= this._start;
    }
}

export class GrowingPlant {
    constructor(private _name: string, private _schedule: GrowSchedule) {}

    public name() {
        return this._name;
    }

    public isGrown() {
        return this._schedule.isComplete(Date.now());
    }
}

export class Field {
    constructor(private growing: Array<GrowingPlant> = []) {}

    public countGrowing(): number {
        return this.growing.length;
    }

    public countGrown(): number {
        return this.growing.filter(p => p.isGrown()).length;
    }

    public sew(type: string) {
        return new Field(
            this.growing.concat(
                new GrowingPlant(type, new GrowSchedule(Date.now())),
            ),
        );
    }

    public harvest(): { seeds: SeedStorage; field: Field } {
        const grown = this.growing.filter(plant => plant.isGrown());
        const seedTypes: { [x: string]: number } = grown.reduce(
            (memo, plant) =>
                Object.assign({}, memo, {
                    [plant.name()]:
                        memo[plant.name()] !== undefined
                            ? memo[plant.name()] + 1
                            : 1,
                }),
            {},
        );

        return {
            seeds: new SeedStorage(
                Object.keys(seedTypes).map(
                    type => new SeedBin(type, seedTypes[type]),
                ),
            ),
            field: new Field(this.growing.filter(plant => !plant.isGrown())),
        };
    }
}
