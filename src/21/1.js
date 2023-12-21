import { loadInput } from '../utils/load-input.js';

const MAX_STEPS = 64;

const directions = {
  N: [0, -1],
  S: [0, 1],
  E: [1, 0],
  W: [-1, 0],
};

const directionValues = Object.values(directions);

const bootstrap = (input) => {
  let start = [0, 0];

  const data = input.split('\n').map((line, y) =>
    line.split('').map((char, x) => {
      if (char === 'S') {
        start = [x, y];

        return '.';
      }

      return char;
    }),
  );

  let steps = 0;
  let cursor = [start];
  const queue = [];
  const visited = {};
  let visitedLocal = {};

  let result = 0;

  while (cursor.length) {
    const [x, y] = cursor.shift();
    visited[`${x},${y}`] = true;

    for (const [dx, dy] of directionValues) {
      const [nx, ny] = [x + dx, y + dy];

      if (data[ny]?.[nx] === '.' && !visitedLocal[`${nx},${ny}`]) {
        queue.unshift([nx, ny]);
        visitedLocal[`${nx},${ny}`] = true;
      }
    }

    if (!cursor.length) {
      if (steps > MAX_STEPS - 2) {
        result = Object.keys(visitedLocal).length;
        break;
      }

      cursor = [...queue];
      queue.length = 0;
      steps += 1;
      visitedLocal = {};
    }
  }

  console.log(result);
};

bootstrap(loadInput('21'));
