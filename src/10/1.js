import { loadInput } from '../utils/load-input.js';

const directions = {
  '|': [['F', '7', '|'], [], ['L', 'J', '|'], []],
  '-': [[], ['7', 'J', '-'], [], ['F', 'L', '-']],
  L: [['|', 'F', '7'], ['-', 'J', '7'], [], []],
  J: [['|', '7', 'F'], [], [], ['-', 'L', 'F']],
  7: [[], [], ['|', 'L', 'J'], ['-', 'F', 'L']],
  F: [[], ['-', '7', 'J'], ['|', 'L', 'J'], []],
};

const angle = {
  0: [0, -1],
  1: [1, 0],
  2: [0, 1],
  3: [-1, 0],
};

const angleReverse = { 0: 2, 1: 3, 2: 0, 3: 1 };

const findNext = (data, x, y, prev, expected = 1) => {
  const result = [];
  const current = data[y][x];
  const [px, py] = prev;

  for (const i in angle) {
    const [dx, dy] = angle[i];
    const nx = x + dx;
    const ny = y + dy;

    const next = data[ny]?.[nx];

    if (
      next !== '.' &&
      (expected === 2 || next !== 'S') &&
      !(nx === px && ny === py) &&
      directions[current]?.[i].includes(next)
    ) {
      result.push([nx, ny]);
    }

    if (result.length >= expected) {
      break;
    }
  }

  return result;
};

const findFirst = (data, x, y) => {
  const result = [];

  for (const i in angle) {
    const [dx, dy] = angle[i];
    const nx = x + dx;
    const ny = y + dy;
    const next = data[ny]?.[nx];

    if (directions[next][angleReverse[i]].length) {
      result.push([nx, ny]);
    }
  }

  return result;
};

const bootstrap = (input) => {
  let start = [0, 0];

  const data = input.split('\n').reduce(
    (prev, row, y) => [
      ...prev,
      row.split('').map((v, x) => {
        if (v === 'S') {
          start = [x, y];
        }

        return v;
      }),
    ],
    [],
  );

  let [right, left] = findFirst(data, start[0], start[1]);
  let lPrev = start;
  let rPrev = start;
  let steps = 1;

  while (true) {
    const [xl, yl] = left;
    const [xr, yr] = right;

    [left] = findNext(data, xl, yl, lPrev);
    [right] = findNext(data, xr, yr, rPrev);

    const isSame = xl === xr && yl === yr;
    const isX = xl === xr && Math.abs(yl - yr) === 1;
    const isY = Math.abs(xl - xr) === 1 && yl === yr;

    if (isSame || isX || isY) {
      break;
    }

    lPrev = [xl, yl];
    rPrev = [xr, yr];

    steps += 1;
  }

  console.log(steps);
};

bootstrap(loadInput('10'));
