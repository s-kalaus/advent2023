import { loadInput } from '../utils/load-input.js';

const parseLine = (line) =>
  line.split('').map((item) => {
    if (item === '.') {
      return null;
    }

    const isNum = item.match(/\d/);

    if (isNum) {
      return +item;
    }

    return item;
  });

const bootstrap = (input) => {
  const data = input.trim().split('\n').map(parseLine);

  const numbers = data.reduce((prev, line, row) => {
    const lineNumbers = [];
    let start = -1;

    for (const col in line) {
      const i = line[col];

      if (typeof i === 'number') {
        if (start === -1) {
          start = +col;
        }
      } else {
        if (start !== -1) {
          const num = +line.slice(start, +col).join('');
          lineNumbers.push({ num, row, col: start, len: `${num}`.length });
          start = -1;
        }
      }
    }

    if (start !== -1) {
      const num = +line.slice(start).join('');
      lineNumbers.push({ num, row, col: start, len: `${num}`.length });
    }

    return [...prev, ...lineNumbers];
  }, []);

  const result = data.reduce((prev, line, row) => {
    let ratio = 0;

    for (const colX in line) {
      const i = line[colX];
      const col = +colX;

      if (i === '*') {
        const nums = numbers.filter(({ col: colN, row: rowN, len }) => {
          if (row < rowN - 1 || row > rowN + 1) {
            return false;
          }

          return !(col < colN - 1 || col > colN + len);
        });

        if (nums.length === 2) {
          ratio += nums[0].num * nums[1].num;
        }
      }
    }

    return prev + ratio;
  }, 0);

  console.log(result);
};

bootstrap(loadInput('03'));
