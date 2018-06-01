import { SeedBin } from './';

describe('SeedBin', () => {
    describe('name', () => {
        it('should report the name', () => {
            const name = 'testing';
            const bin = new SeedBin(name);
            expect(bin.name()).toBe(name);
        });
    });

    describe('count', () => {
        it('should default', () => {
            const bin = new SeedBin('test');
            expect(bin.count()).toBe(0);
        });
        it('should report the provided count', () => {
            const count = 888;
            const bin = new SeedBin('test', count);
            expect(bin.count()).toBe(count);
        });
    });

    describe('add', () => {
        it('should increment the count by 1', () => {
            const bin = new SeedBin('test');
            expect(bin.add().count()).toBe(1);
        });
        it('should increment by the provided value', () => {
            const bin = new SeedBin('test');
            const value = 8;
            expect(bin.add(value).count()).toBe(value);
        });
        it('should not mutate', () => {
            const bin = new SeedBin('test');
            bin.add(8);
            expect(bin.count()).toBe(0);
        });
    });

    describe('remove', () => {
        it('should decrement the count by 1', () => {
            const bin = new SeedBin('test', 1);
            expect(bin.remove().count()).toBe(0);
        });
        it('should not drop below 0', () => {
            const bin = new SeedBin('test');
            expect(bin.remove().count()).toBe(0);
        });
        it('should decrement by the provided value', () => {
            const bin = new SeedBin('test', 10);
            expect(bin.remove(3).count()).toBe(7);
        });
        it('should not mutate the SeedBin', () => {
            const bin = new SeedBin('test', 9);
            bin.remove();
            expect(bin.count()).toBe(9);
        });
    });

    describe('sameBreed', () => {
        it('should return false if bins are not of the same type', () => {
            const normal = new SeedBin('normal');
            const standard = new SeedBin('standard');
            expect(normal.sameBreed(standard)).toBe(false);
        });
        it('should return true if the bins are of the same type', () => {
            const one = new SeedBin('normal', 8);
            const two = new SeedBin('normal', 12);
            expect(one.sameBreed(two)).toBe(true);
        });
    });
});
