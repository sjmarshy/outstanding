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
        // console.log('breed check', this._name, bin.name(), this.name() === bin.name());
        return this.name() === bin.name();
    }
}
