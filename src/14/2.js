import { loadInput } from '../utils/load-input.js';

const CYCLES_COUNT = 1000000000;

const calcHash = (data) => data.map((row) => row.join('')).join('');

const rollN = ({ data, width, height }) => {
  for (let x = 0; x < width; x += 1) {
    let empty = 0;

    for (let y = 0; y < height; y += 1) {
      if (data[y][x] === '#') {
        empty = y + 1;
      }

      if (data[y][x] === 'O') {
        if (empty < y) {
          data[empty][x] = 'O';
          data[y][x] = '.';
        }

        empty += 1;
      }
    }
  }
};

const rollW = ({ data, width, height }) => {
  for (let y = 0; y < height; y += 1) {
    let empty = 0;

    for (let x = 0; x < width; x += 1) {
      if (data[y][x] === '#') {
        empty = x + 1;
      }

      if (data[y][x] === 'O') {
        if (empty < x) {
          data[y][empty] = 'O';
          data[y][x] = '.';
        }

        empty += 1;
      }
    }
  }
};

const rollS = ({ data, width, height }) => {
  for (let x = 0; x < width; x += 1) {
    let empty = height - 1;

    for (let y = height - 1; y >= 0; y -= 1) {
      if (data[y][x] === '#') {
        empty = y - 1;
      }

      if (data[y][x] === 'O') {
        if (empty > y) {
          data[empty][x] = 'O';
          data[y][x] = '.';
        }

        empty -= 1;
      }
    }
  }
};

const rollE = ({ data, width, height }) => {
  for (let y = 0; y < height; y += 1) {
    let empty = width - 1;

    for (let x = width - 1; x >= 0; x -= 1) {
      if (data[y][x] === '#') {
        empty = x - 1;
      }

      if (data[y][x] === 'O') {
        if (empty > x) {
          data[y][empty] = 'O';
          data[y][x] = '.';
        }

        empty -= 1;
      }
    }
  }
};

const run = ({ data, width, height }) => {
  rollN({ data, width, height });
  rollW({ data, width, height });
  rollS({ data, width, height });
  rollE({ data, width, height });
};

const bootstrap = (input) => {
  const data = input.split('\n').map((line) => line.split(''));

  const height = data.length;
  const width = data[0].length;

  const vars = {
    [calcHash(data)]: true,
  };

  let result = 0;

  for (let c = 0; c < CYCLES_COUNT; c += 1) {
    run({ data, width, height });

    const hash = calcHash(data);

    if (vars[hash]) {
      const loopStart = Object.keys(vars).findIndex((h) => h === hash);
      const left = (CYCLES_COUNT - c - 1) % (c - loopStart + 1);

      for (let i = 0; i < left; i += 1) {
        run({ data, width, height });
      }

      result = data[0].reduce((prev, _, x) => {
        let count = 0;

        for (let y = 0; y < data.length; y += 1) {
          if (data[y][x] === 'O') {
            count += data.length - y;
          }
        }

        return prev + count;
      }, 0);

      break;
    }

    vars[hash] = true;
  }

  console.log(result);
};

bootstrap(loadInput('14'));
