import { loadInput } from '../utils/load-input.js';

const processIt = (cache, line, cvc, lvl, cvcIndex, cvcAt) => {
  const key = `${lvl},${cvcIndex},${cvcAt}`;

  if (key in cache) {
    return cache[key];
  }

  if (lvl === line.length) {
    return (cvcIndex === cvc.length && cvcAt === 0) ||
      (cvcIndex === cvc.length - 1 && cvc[cvcIndex] === cvcAt)
      ? 1
      : 0;
  }

  let count = 0;

  if (['#', '?'].includes(line[lvl])) {
    count += processIt(cache, line, cvc, lvl + 1, cvcIndex, cvcAt + 1);
  }

  if (['.', '?'].includes(line[lvl])) {
    let diff =
      cvcAt === 0
        ? 0
        : cvcAt > 0 && cvcIndex < cvc.length && cvc[cvcIndex] === cvcAt
          ? 1
          : -1;

    if (diff !== -1) {
      count += processIt(cache, line, cvc, lvl + 1, cvcIndex + diff, 0);
    }
  }

  cache[key] = count;

  return count;
};

const bootstrap = (input) => {
  const data = input.split('\n').map((line) => {
    const [data, cvc] = line.split(' ');

    return [
      new Array(5).fill(data).join('?').split(''),
      new Array(5).fill(cvc.split(',').map(Number)).flat(),
    ];
  });

  const result = data
    .map((line) => processIt({}, ...line, 0, 0, 0))
    .reduce((prev, count) => prev + count, 0);

  console.log(result);
};

bootstrap(loadInput('12'));
