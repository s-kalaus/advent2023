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

  const valid = numbers.filter(
    ({ num, row, col: colStart }) =>
      !!`${num}`.split('').find((n, idx) => {
        const col = colStart + idx;

        const lt = typeof data[row - 1]?.[col - 1] === 'string';
        const t = typeof data[row - 1]?.[col] === 'string';
        const rt = typeof data[row - 1]?.[col + 1] === 'string';

        const r = typeof data[row]?.[col + 1] === 'string';

        const rb = typeof data[row + 1]?.[col + 1] === 'string';
        const b = typeof data[row + 1]?.[col] === 'string';
        const lb = typeof data[row + 1]?.[col - 1] === 'string';

        const l = typeof data[row]?.[col - 1] === 'string';

        return lt || t || rt || r || rb || b || lb || l;
      }),
  );

  const result = valid.reduce((prev, { num }) => prev + num, 0);

  console.log(result);
};

bootstrap(loadInput('03'));
