import { loadInput } from '../utils/load-input.js';

const bootstrap = (input) => {
  const result = input
    .trim()
    .split('\n')
    .reduce((prev, gameRaw) => {
      const [, gameClean] = gameRaw.split(': ');

      const { red, green, blue } = gameClean.split('; ').reduce(
        (prev, turnRaw) => {
          const { red, green, blue } = turnRaw.split(', ').reduce(
            (thePrev, turn) => {
              const [count, color] = turn.split(' ');

              return {
                ...thePrev,
                [color]: thePrev[color] + +count,
              };
            },
            { red: 0, green: 0, blue: 0 },
          );

          return {
            red: red > prev.red ? red : prev.red,
            green: green > prev.green ? green : prev.green,
            blue: blue > prev.blue ? blue : prev.blue,
          };
        },
        { red: 0, green: 0, blue: 0 },
      );

      return prev + red * green * blue;
    }, 0);

  console.log(result);
};

bootstrap(loadInput('02'));
