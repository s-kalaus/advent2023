import { loadInput } from '../utils/load-input.js';

const getState = (data) => data.map((brick) => brick[1][2]).join(',');

const intersects = ({ base, x, y, z }) =>
  base[0][0] <= x &&
  base[1][0] >= x &&
  base[0][1] <= y &&
  base[1][1] >= y &&
  base[0][2] <= z &&
  base[1][2] >= z;

const letItFall = ({ data }) => {
  const fallen = {};
  let state = '';

  while (state !== getState(data)) {
    state = getState(data);

    for (let i = 0; i < data.length; i += 1) {
      const brick = data[i];

      if (brick[0][2] <= 1) {
        continue;
      }

      let collided = false;

      for (let x = brick[0][0]; x <= brick[1][0]; x += 1) {
        for (let y = brick[0][1]; y <= brick[1][1]; y += 1) {
          if (
            data.some(
              (base, idx) =>
                i !== idx && intersects({ base, x, y, z: brick[0][2] - 1 }),
            )
          ) {
            collided = true;
            break;
          }
        }
      }

      if (!collided) {
        brick[1][2] -= 1;
        brick[0][2] -= 1;
        fallen[i] = true;
      }
    }
  }

  return Object.keys(fallen).length;
};

const bootstrap = (input) => {
  const data = input
    .split('\n')
    .map((line) => line.split('~').map((item) => item.split(',').map(Number)))
    .sort((a, b) => b[1][2] - a[1][2]);

  let result = 0;

  letItFall({ data });

  for (let i = 0; i < data.length; i += 1) {
    const dataUpdated = JSON.parse(JSON.stringify(data));

    dataUpdated.splice(i, 1);

    result += letItFall({ data: dataUpdated });
  }

  console.log(result);
};

bootstrap(loadInput('22'));
