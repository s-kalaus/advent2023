import { loadInput } from '../utils/load-input.js';

const mod = (n, m) => ((n % m) + m) % m;

const diffs = (row) => row.map((v, i) => v - row[i - 1]).slice(1);

const directions = {
  N: [0, -1],
  S: [0, 1],
  E: [1, 0],
  W: [-1, 0],
};

const directionValues = Object.values(directions);

const bootstrap = (input) => {
  let start = {};
  const k = (x, y) => x + ',' + y;

  const map = input.split('\n').map((line, y) =>
    line.split('').map((char, x) => {
      if (char === 'S') {
        start[k(x, y)] = [x, y, 1];

        return '.';
      }

      return char;
    }),
  );

  const run = (arr) =>
    arr.map((step) => {
      while (step.some((v) => v !== 0)) {
        step = diffs(step);
        arr.push(step);
      }

      return arr.map((v) => v[0]);
    })[0];

  const next = (start) => {
    const updated = {};

    Object.values(start).forEach(([x, y]) => {
      directionValues.forEach(([dx, dy]) => {
        if (map[mod(y + dy, map.length)][mod(x + dx, map.length)] === '.') {
          updated[k(x + dx, y + dy)] = [x + dx, y + dy];
        }
      });
    });

    return updated;
  };

  const values = [];

  for (let i = 1; i <= 131 * 2 + 65; i += 1) {
    start = next(start);

    if (i % 131 === 65) {
      values.push(Object.keys(start).length);
    }
  }

  const [v0, v1, v2] = run([values]);
  const target = (26501365 - 65) / 131;
  const result = v0 + v1 * target + (target * (target - 1) * v2) / 2;

  console.log(result);
};

bootstrap(loadInput('21'));
