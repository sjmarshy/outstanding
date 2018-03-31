const totalSeeds = s =>
    Object.keys(s.seeds.type).reduce(
        (count, type) => count + s.seeds.type[type],
        0,
    );

export { totalSeeds };
