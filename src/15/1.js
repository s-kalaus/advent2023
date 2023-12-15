import { loadInput } from '../utils/load-input.js';

const bootstrap = (input) => {
  const result = input.split(',').reduce(
    (prev, line) =>
      prev +
      line.split('').reduce((prev, char) => {
        let val = prev;

        val += char.charCodeAt(0);
        val *= 17;
        val %= 256;

        return val;
      }, 0),
    0,
  );

  console.log(result);
};

bootstrap(loadInput('15'));
