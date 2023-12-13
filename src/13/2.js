import { loadInput } from '../utils/load-input.js';

const H_FACTOR = 100;

const rotateCCW = (block) =>
  block[0].map((_, colIndex) => block.map((row) => row[colIndex]));

const bootstrap = (input) => {
  const blocks = input.split('\n\n').map((block) => {
    const vertical = block.split('\n').map((line) => line.split(''));

    return {
      vertical,
      horizontal: rotateCCW(vertical),
    };
  });

  const result = blocks
    .map(({ vertical, horizontal }) => [vertical, horizontal])
    .map((grids) => {
      return grids.map((grid) => {
        let count = 0;

        for (let gridIdx = 0; gridIdx < grid.length; gridIdx += 1) {
          let index = 1;
          let diff = 0;

          while (true) {
            if (gridIdx + 1 - index < 0 || gridIdx + index >= grid.length) {
              break;
            }

            diff += grid[gridIdx + 1 - index].filter(
              (char, idx) => char !== grid[gridIdx + index][idx],
            ).length;

            if (diff > 1) {
              break;
            }

            index += 1;
          }
          if (
            index > 1 &&
            (gridIdx + 1 - index === -1 || gridIdx + index === grid.length) &&
            diff === 1
          ) {
            count = gridIdx + 1;
          }
        }

        return count;
      });
    })
    .reduce(
      (prev, [vertical, horizontal]) => prev + vertical * H_FACTOR + horizontal,
      0,
    );

  console.log(result);
};

bootstrap(loadInput('13'));
