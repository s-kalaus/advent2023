import Heapify from 'heapify';
import { loadInput } from '../utils/load-input.js';

const QUEUE_SIZE = 1_000_000; // just guessing
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
  const raw = [];
  const queue = new Heapify.MinQueue(QUEUE_SIZE);
  raw.push({ heat: 0, current: { x: 0, y: 0 }, dir: { x: 0, y: 0 } });
  queue.push(raw.length - 1, 0);
  const visited = {};

  while (queue.size) {
    const index = queue.pop();
    const { heat, current, dir } = raw[index];
    delete raw[index];

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

      for (let i = 1; i <= 10; i++) {
        xx = xx + dx;
        yy = yy + dy;

        if (data[yy]?.[xx]) {
          heatCalc += data[yy][xx];

          if (i >= 4) {
            raw.push({
              heat: heatCalc,
              current: { x: xx, y: yy },
              dir: { x: dx, y: dy },
            });

            queue.push(raw.length - 1, heatCalc);
          }
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
