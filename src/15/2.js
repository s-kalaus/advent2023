import { loadInput } from '../utils/load-input.js';

const getHash = (line) =>
  line.split('').reduce((prev, char) => {
    let val = prev;

    val += char.charCodeAt(0);
    val *= 17;
    val %= 256;

    return val;
  }, 0);

const bootstrap = (input) => {
  const boxes = {};
  const actions = input.trim().split(',');

  actions.forEach((action) => {
    const [label, focal] = action.split(/[-=]/i);
    const boxIndex = getHash(label);

    if (!boxes[boxIndex]) {
      boxes[boxIndex] = {};
    }

    if (focal === '') {
      delete boxes[boxIndex][label];

      if (!Object.keys(boxes[boxIndex]).length) {
        delete boxes[boxIndex];
      }
    } else {
      if (label in boxes[boxIndex]) {
        boxes[boxIndex][label] = +focal;
      } else {
        boxes[boxIndex] = {
          ...boxes[boxIndex],
          [label]: +focal,
        };
      }
    }
  });

  const result = Object.entries(boxes).reduce(
    (prev, [boxIndex, box]) =>
      prev +
      Object.entries(box).reduce(
        (prev, [label, focal], slot) =>
          prev + (+boxIndex + 1) * (slot + 1) * focal,
        0,
      ),
    0,
  );

  console.log(result);
};

bootstrap(loadInput('15'));
