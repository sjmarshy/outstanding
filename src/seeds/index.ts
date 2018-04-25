import { lensPath, view, set, over, curryN, compose } from 'ramda';
import option, { Option, fromNullable } from 'fp-ts/lib/Option';

export class SeedBin {
    constructor(private _name: string, private _count: number = 0) {}

    count() {
        return this._count;
    }

    name() {
        return this._name;
    }

    add(count = 1) {
        return new SeedBin(this._name, this._count + count);
    }

    remove(count = 1) {
        return new SeedBin(this._name, Math.max(this._count - count, 0));
    }

    sameBreed(bin: SeedBin): boolean {
        console.log('breed check');
        return this._name === bin.name();
    }
}

export class SeedStorage {
    constructor(private bins: Array<SeedBin> = []) {}

    store(bin) {
        return new SeedStorage(this.bins.concat(bin));
    }

    retrieve(binName): Option<SeedBin> {
        return fromNullable(this.bins.find(bin => bin.name() === binName));
    }

    count(binName): Option<number> {
        return this.retrieve(binName).map(sb => sb.count());
    }

    countAll(): number {
        return this.bins.reduce((count, bin) => count + bin.count(), 0);
    }

    merge(store: SeedStorage): SeedStorage {
        return new SeedStorage(
            this.bins.concat(store.bins).reduce(
                (memo: Array<SeedBin>, bin: SeedBin) => {
                    const newBin = fromNullable(
                        memo.find(bin_ => bin.sameBreed(bin_)),
                    )
                        .map(bin_ => {
                            return new SeedBin(
                                bin_.name(),
                                bin.count() + bin_.count(),
                            );
                        })
                        .getOrElse(bin);

                    return memo
                        .filter(bin_ => bin.sameBreed(bin_))
                        .concat(newBin);
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
