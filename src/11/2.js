import { loadInput } from '../utils/load-input.js';

const k = (x, y) => `${x},${y}`;

const EXPAND_FACTOR = 1000000;

const bootstrap = (input) => {
  const factor = EXPAND_FACTOR - 1 || 1;
  const lines = input.split('\n').map((line) => line.split(''));

  const width = lines[0].length;
  const height = lines.length;

  const eX = [];
  const eY = [];

  // Expand Y
  for (let i = height - 1; i >= 0; i -= 1) {
    if (lines[i].some((v) => v !== '.')) {
      continue;
    }

    eY.push(i);
  }

  // Expand X
  for (let i = width - 1; i >= 0; i -= 1) {
    if (lines.some((line) => line[i] !== '.')) {
      continue;
    }

    eX.push(i);
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

    const minX = Math.min(x0, x1);
    const maxX = Math.max(x0, x1);

    const minY = Math.min(y0, y1);
    const maxY = Math.max(y0, y1);

    const countEX = eX.filter((x) => x > minX && x < maxX).length;
    const countEY = eY.filter((y) => y > minY && y < maxY).length;

    pair[2] =
      Math.abs(x0 - x1) +
      countEX * factor +
      Math.abs(y0 - y1) +
      countEY * factor;
  });

  const result = pairs.reduce((prev, [, , distance]) => prev + distance, 0);

  console.log(result);
};

bootstrap(loadInput('11'));
