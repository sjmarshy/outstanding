import { lensPath, view, set, over, curryN, compose } from 'ramda';
import option, { Option, fromNullable } from 'fp-ts/lib/Option';
import { SeedBin } from './SeedBin';

/**
 * a collection of SeedBins
 */
export class SeedStorage {
    constructor(private bins: Array<SeedBin> = []) {}

    /**
     * create a new seed storage with the provided seed bin
     * @todo we should not have more than one bin for any breed of bin, they should merge instead
     * @param bin the seed bin to store
     */
    store(bin: SeedBin) {
        return new SeedStorage(this.bins.concat(bin));
    }

    retrieve(binName: string): Option<SeedBin> {
        console.log(this.bins);
        return fromNullable(
            this.bins.find((bin: SeedBin) => bin.name() === binName),
        );
    }

    count(binName: string): Option<number> {
        return this.retrieve(binName).map(sb => sb.count());
    }

    countAll(): number {
        return this.bins.reduce((count, bin) => count + bin.count(), 0);
    }

    /**
     * merge the provided SeedStorage with this one
     * @param store
     */
    merge(store: SeedStorage): SeedStorage {
        return new SeedStorage(
            this.bins.concat(store.bins).reduce(
                (memo: Array<SeedBin>, bin: SeedBin) => {
                    if (memo.some(bin_ => bin_.sameBreed(bin))) {
                        return memo.map(
                            bin_ =>
                                bin_.sameBreed(bin)
                                    ? bin.add(bin_.count())
                                    : bin,
                        );
                    } else {
                        return memo.concat(bin);
                    }
                },
                [] as Array<SeedBin>,
            ),
        );
    }

    addTo(binName: string, count: number) {
        return new SeedStorage(
            this.bins.map(
                bin => (bin.name() === binName ? bin.add(count) : bin),
            ),
        );
    }

    pluck(binName: string, count: number) {
        return new SeedStorage(
            this.bins.map(
                bin => (bin.name() === binName ? bin.remove(count) : bin),
            ),
        );
    }
}
