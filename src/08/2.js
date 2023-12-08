import { loadInput } from '../utils/load-input.js';

const gcd = (a, b) => {
  for (let temp = b; b !== 0; ) {
    b = a % b;
    a = temp;
    temp = b;
  }

  return a;
};

const lcm = (a, b) => {
  return (a * b) / gcd(a, b);
};

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

  const starts = Object.keys(rules).reduce(
    (prev, node) => [...prev, ...(node[2] === 'A' ? [node] : [])],
    [],
  );

  const getSteps = (path) => {
    let cursorPaths = path;
    let cursorSchema = 0;
    let steps = 0;

    while (true) {
      if (cursorPaths[2] === 'Z') {
        break;
      }

      cursorPaths = rules[cursorPaths][schema[cursorSchema]];
      steps += 1;

      if (cursorSchema >= schema.length - 1) {
        cursorSchema = 0;
      } else {
        cursorSchema += 1;
      }
    }

    return steps;
  };

  const result = starts.map(getSteps).reduce(lcm);

  console.log(result);
};

bootstrap(loadInput('08'));
