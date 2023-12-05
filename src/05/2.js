import { loadInput } from '../utils/load-input.js';

const bootstrap = (input) => {
  const [seedsRaw, ...overridesRaw] = input.split('\n\n');
  const [, seedsStr] = seedsRaw.split(': ');
  const seedPairsRaw = seedsStr.split(' ').map((seed) => +seed);
  const seedPairs = [];
  const locations = [];

  for (let i = 0; i < seedPairsRaw.length; i += 2) {
    seedPairs.push([seedPairsRaw[i], seedPairsRaw[i + 1]]);
  }

  const overrides = overridesRaw.reduce((prev, overrideRaw) => {
    const [, dataRaw] = overrideRaw.split(':');
    return [
      ...prev,
      dataRaw
        .trim()
        .split('\n')
        .map((line) => {
          const [destination, source, count] = line.split(' ').map(Number);

          return {
            source: { start: source, end: source + count },
            destination: { start: destination, end: destination + count },
          };
        }),
    ];
  }, []);

  const getLocation = (seed) =>
    overrides.reduce((prev, override, idx) => {
      const { source, destination } = override.find(
        ({ source }) => prev >= source.start && prev <= source.end,
      ) ?? { source: { start: prev }, destination: { start: prev } };

      const diff = prev - source.start;

      return destination.start + diff;
    }, seed);

  for (const [seed, num] of seedPairs) {
    console.log(`Processing seed ${seed} with ${num} iterations: START`);

    let min = null;

    for (let i = 0; i < num; i++) {
      const location = getLocation(seed + i);

      if (min === null || location < min) {
        min = location;
      }
    }

    locations.push(min);

    console.log(`Processing seed ${seed} with ${num} iterations: FINISH`);
  }

  console.log(Math.min(...locations));
};

bootstrap(loadInput('05'));
