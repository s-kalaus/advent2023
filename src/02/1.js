import { loadInput } from '../utils/load-input.js';

const constraints = { red: 12, green: 13, blue: 14 };

const bootstrap = (input) => {
  const result = input
    .trim()
    .split('\n')
    .reduce((prev, gameRaw) => {
      const [header, gameClean] = gameRaw.split(': ');
      const [, id] = header.split(' ');

      const isPossible = gameClean.split('; ').every((turnRaw) => {
        const colors = turnRaw.split(', ');

        return colors.every((color) => {
          const [count, name] = color.split(' ');

          return +count <= constraints[name];
        });
      });

      return prev + (isPossible ? +id : 0);
    }, 0);

  console.log(result);
};

bootstrap(loadInput('02'));
