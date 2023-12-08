import { loadInput } from '../utils/load-input.js';

const bootstrap = (input) => {
  const [schema, body] = input.split('\n\n');
  const rules = body.split('\n').reduce((prev, rule) => {
    const [start, path] = rule.replace(/[)(]/g, '').split(' = ');
    const [L, R] = path.split(', ');
    return {
      ...prev,
      [start]: { L, R },
    };
  }, {});

  let cursorPaths = 'AAA';
  let cursorSchema = 0;
  let result = 0;

  while (true) {
    if (cursorPaths === 'ZZZ') {
      break;
    }

    cursorPaths = rules[cursorPaths][schema[cursorSchema]];
    result += 1;

    if (cursorSchema >= schema.length - 1) {
      cursorSchema = 0;
    } else {
      cursorSchema += 1;
    }
  }

  console.log(result);
};

bootstrap(loadInput('08'));
