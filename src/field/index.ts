import { SeedBin } from '../seeds/SeedBin';
import { SeedStorage } from '../seeds/SeedStorage';
import { ONE_SECOND } from '../constants/time';

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

/**
 * the result of a harvest.
 * Contains the field that has been harvested, with any still growing plants intact,
 * and the harvested seeds
 */
export class Harvest {
    constructor(private seeds: SeedStorage, private field: Field) {}
    public extractSeeds(): SeedStorage {
        return this.seeds;
    }

    public getField(): Field {
        return this.field;
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

    /**
     *
     * @param type the type of seed to sew
     */
    public sew(type: string): Field {
        return new Field(
            this.growing.concat(
                new GrowingPlant(
                    type,
                    new GrowSchedule(Date.now() + ONE_SECOND * 3),
                ),
            ),
        );
    }

    /**
     * produce a survey of the counts of harvestable seeds and their types
     */
    public harvestSurvey(): Record<string, number> {
        return this.growing.filter(plant => plant.isGrown()).reduce(
            (survey, plant) =>
                Object.assign(survey, {
                    [plant.name()]:
                        survey[plant.name()] !== undefined
                            ? survey[plant.name()] + 1
                            : 1,
                }),
            {} as Record<string, number>,
        );
    }

    /**
     * return a Harvest object with the Harvested field and the filled SeedBins
     */
    public harvest(): Harvest {
        const survey = this.harvestSurvey();
        return new Harvest(
            new SeedStorage(
                Object.keys(survey).map(
                    type => new SeedBin(type, survey[type]),
                ),
            ),
            new Field(this.growing.filter(plant => !plant.isGrown())),
        );
    }
}
