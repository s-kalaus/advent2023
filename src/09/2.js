import { loadInput } from '../utils/load-input.js';

const predict = (line) => {
  const rows = [];
  let arr = line;

  while (true) {
    const values = [];

    for (let i = 1; i < arr.length; i += 1) {
      const value = arr[i] - arr[i - 1];

      values.push(value);
    }

    if (values.join('').match(/[^0]/g)) {
      rows.push(values);
      arr = values;
    } else {
      break;
    }
  }

  return [line, ...rows]
    .reverse()
    .reduce((prev, current) => current[0] - prev, 0);
};

const bootstrap = (input) => {
  const lines = input.split('\n').map((line) => line.split(' ').map(Number));
  const result = lines.reduce((prev, line) => prev + predict(line), 0);

  console.log(result);
};

bootstrap(loadInput('09'));
