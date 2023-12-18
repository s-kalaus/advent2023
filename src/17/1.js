import { loadInput } from '../utils/load-input.js';
import { getMinHeap } from '../utils/get-min-heap.js';

const possibleDirs = {
  '1,0': { x: 1, y: 0 },
  '0,1': { x: 0, y: 1 },
  '-1,0': { x: -1, y: 0 },
  '0,-1': { x: 0, y: -1 },
};

const getVisitedKey = (current, dir) =>
  `${current.x},${current.y},${dir.x},${dir.y}`;

const run = (data) => {
  const finish = { x: data[0].length - 1, y: data.length - 1 };
  const queue = getMinHeap();

  queue.push({ heat: 0, current: { x: 0, y: 0 }, dir: { x: 0, y: 0 } }, 0);

  const visited = {};

  while (queue.size) {
    const { heat, current, dir } = queue.pop();

    if (current.x === finish.x && current.y === finish.y) {
      return heat;
    }

    const visitedKey = getVisitedKey(current, dir);

    if (visited[visitedKey]) {
      continue;
    }

    visited[visitedKey] = true;

    const dirs = { ...possibleDirs };

    delete dirs[`${dir.x},${dir.y}`];
    delete dirs[`${-dir.x},${-dir.y}`];

    Object.values(dirs).forEach(({ x: dx, y: dy }) => {
      let xx = current.x;
      let yy = current.y;
      let heatCalc = heat;

      for (let i = 1; i <= 3; i++) {
        xx = xx + dx;
        yy = yy + dy;

        if (data[yy]?.[xx]) {
          heatCalc += data[yy][xx];

          queue.push(
            {
              heat: heatCalc,
              current: { x: xx, y: yy },
              dir: { x: dx, y: dy },
            },
            heatCalc,
          );
        }
      }
    });
  }

  throw new Error('Is it possible?');
};

const bootstrap = (input) => {
  const data = input.split('\n').map((line) => line.split('').map(Number));

  const result = run(data);

  console.log(result);
};

bootstrap(loadInput('17'));
