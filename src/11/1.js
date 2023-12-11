import { loadInput } from '../utils/load-input.js';

const k = (x, y) => `${x},${y}`;

const bootstrap = (input) => {
  const lines = input.split('\n').map((line) => line.split(''));

  const width = lines[0].length;
  const height = lines.length;

  // Expand Y
  for (let i = height - 1; i >= 0; i -= 1) {
    if (lines[i].some((v) => v !== '.')) {
      continue;
    }

    lines.splice(i, 0, [...lines[i]]);
  }

  // Expand X
  for (let i = width - 1; i >= 0; i -= 1) {
    if (lines.some((line) => line[i] !== '.')) {
      continue;
    }

    lines.forEach((line) => line.splice(i, 0, '.'));
  }

  const stars = [];

  lines.forEach((line, y) => {
    line.forEach((sym, x) => {
      if (sym === '#') {
        stars.push([x, y]);
      }
    });
  });

  const pairsRaw = {};

  for (let i = 0; i < stars.length; i += 1) {
    const k0 = k(...stars[i]);
    for (let c = i + 1; c < stars.length; c += 1) {
      const k1 = k(...stars[c]);

      if (!pairsRaw[k0]) {
        pairsRaw[k0] = [];
      }

      if (!pairsRaw[k0].includes(k1)) {
        pairsRaw[k0].push(k1);
      }
    }
  }

  const pairs = Object.entries(pairsRaw).reduce(
    (prev, [k0, items]) => [
      ...prev,
      ...items.map((k1) => [
        k0.split(',').map(Number),
        k1.split(',').map(Number),
      ]),
    ],
    [],
  );

  pairs.forEach((pair) => {
    const [[x0, y0], [x1, y1]] = pair;
    pair[2] = Math.abs(x0 - x1) + Math.abs(y0 - y1);
  });

  const result = pairs.reduce((prev, [, , distance]) => prev + distance, 0);

  console.log(result);
};

bootstrap(loadInput('11'));
