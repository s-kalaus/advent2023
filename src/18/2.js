import { loadInput } from '../utils/load-input.js';

const directions = {
  R: { x: 1, y: 0 },
  D: { x: 0, y: -1 },
  L: { x: -1, y: 0 },
  U: { x: 0, y: 1 },
};

const run = ({ data }) => {
  const trench = [];

  let current = { x: 0, y: 0 };
  let total = 0;

  for (const { direction, moves } of data) {
    const { x: dx, y: dy } = directions[direction];
    current = { x: current.x + moves * dx, y: current.y + moves * dy };
    total += moves;
    trench.push(current);
  }

  // https://en.wikipedia.org/wiki/Shoelace_formula
  const sum = trench.reduce(
    (prev, { x, y }, idx) =>
      prev +
      (idx < trench.length - 1
        ? (x + trench[idx + 1].x) * (y - trench[idx + 1].y)
        : 0),
    0,
  );

  // https://en.wikipedia.org/wiki/Pick%27s_theorem
  return (total + sum) / 2 + 1;
};

const bootstrap = (input) => {
  const data = input.split('\n').map((line) => {
    const [, , color1] = line.split(' ');
    const [, color2] = color1.split('#');
    const [color] = color2.split(')');
    const direction = Object.keys(directions)[parseInt(color.slice(-1))];
    const moves = parseInt(color.slice(0, -1), 16);

    return { direction, moves: +moves };
  });

  const result = run({ data });

  console.log(result);
};

bootstrap(loadInput('18'));
