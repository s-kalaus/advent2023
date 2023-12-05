import { loadInput } from '../utils/load-input.js';

const bootstrap = (input) => {
  const [seedsRaw, ...overridesRaw] = input.split('\n\n');
  const [, seedsStr] = seedsRaw.split(': ');
  const seeds = seedsStr.split(' ').map((seed) => +seed);
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

  const locations = seeds.map((seed) =>
    overrides.reduce((prev, override) => {
      const { source, destination } = override.find(
        ({ source }) => prev >= source.start && prev <= source.end,
      ) ?? { source: { start: prev }, destination: { start: prev } };

      const diff = prev - source.start;

      return destination.start + diff;
    }, seed),
  );

  console.log(Math.min(...locations));
};

bootstrap(loadInput('05'));
