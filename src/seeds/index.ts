import { lensPath, view, set, over, curryN, compose } from 'ramda';
import option, { Option, fromNullable } from 'fp-ts/lib/Option';
import { SeedBin } from './SeedBin';

export class SeedStorage {
    constructor(private bins: Array<SeedBin> = []) {}

    store(bin) {
        return new SeedStorage(this.bins.concat(bin));
    }

    retrieve(binName): Option<SeedBin> {
        console.log(this.bins);
        return fromNullable(this.bins.find(bin => bin.name() === binName));
    }

    count(binName): Option<number> {
        return this.retrieve(binName).map(sb => sb.count());
    }

    countAll(): number {
        return this.bins.reduce((count, bin) => count + bin.count(), 0);
    }

    merge(store: SeedStorage): SeedStorage {
        console.log('merging ', this, 'with ', store);
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
