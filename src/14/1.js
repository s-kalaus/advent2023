import { loadInput } from '../utils/load-input.js';

const bootstrap = (input) => {
  const data = input.split('\n').map((line) => line.split(''));

  const height = data.length;

  const result = data[0].reduce((prev, _, x) => {
    let count = 0;
    let empty = 0;

    for (let y = 0; y < data.length; y += 1) {
      if (data[y][x] === '#') {
        empty = y + 1;
      }

      if (data[y][x] === 'O') {
        if (empty < y) {
          data[empty][x] = 'O';
          data[y][x] = '.';
          count += height - empty;
        } else {
          count += height - y;
        }

        empty += 1;
      }
    }

    return prev + count;
  }, 0);

  console.log(result);
};

bootstrap(loadInput('14'));
