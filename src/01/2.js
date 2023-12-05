import { loadInput } from '../utils/load-input.js';

const nums = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
];
const numsReverse = nums.map((num) => num.split('').reverse().join(''));

const bootstrap = (input) => {
  const result = input.split('\n').reduce((prev, str) => {
    const found1 = nums.reduce(
      (prev, num, index) => {
        const idx = str.indexOf(num);

        return {
          ...prev,
          ...(idx !== -1 && (prev.minIdx === null || idx < prev.minIdx)
            ? {
                minIdx: idx,
                num: index + 1,
              }
            : {}),
        };
      },
      { minIdx: null, num: 0 },
    );

    const digitsForward = (
      found1.num === 0
        ? str
        : str.replaceAll(nums[found1.num - 1] ?? '', `${found1.num}`)
    ).match(/[^a-z]/gi, '');

    const strReverse = str.split('').reverse().join('');

    const foundStrNum = numsReverse.reduce(
      (prev, num, index) => {
        const idx = strReverse.indexOf(num);

        return {
          ...prev,
          ...(idx !== -1 && (prev.minIdx === null || idx < prev.minIdx)
            ? {
                minIdx: idx,
                num: index + 1,
              }
            : {}),
        };
      },
      { minIdx: null, num: 0 },
    );

    const digitsReverse = (
      foundStrNum.num === 0
        ? str
        : str.replaceAll(nums[foundStrNum.num - 1] ?? '', `${foundStrNum.num}`)
    ).match(/[^a-z]/gi, '');

    return (
      prev +
      +[digitsForward[0], digitsReverse[digitsReverse.length - 1]].join('')
    );
  }, 0);

  console.log(result);
};

bootstrap(loadInput('01'));
