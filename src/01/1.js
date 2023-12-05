import { loadInput } from '../utils/load-input.js';

const bootstrap = (input) => {
  const result = input.split('\n').reduce((prev, str) => {
    const digits = str.match(/[^a-z]/gi);
    return prev + +[digits[0], digits[digits.length - 1]].join('');
  }, 0);

  console.log(result);
};

bootstrap(loadInput('01'));
