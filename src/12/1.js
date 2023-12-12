import { loadInput } from '../utils/load-input.js';

const variants = ['.', '#'];

const genRegExp = (cvc) =>
  new RegExp(`^\\.*?${cvc.map((cnt) => `#{${cnt}}`).join('\\.+')}\\.*?$`);

const recreateString = ({ data, placeholders }) =>
  Object.entries(placeholders)
    .reduce(
      (prev, [idx, char]) => {
        prev.splice(+idx, 1, char);
        return prev;
      },
      [...data],
    )
    .join('');

const countIt = (props) => {
  const { data, placeholders, regExp, maxDepth, depth = 0 } = props;

  let count = 0;

  const str = recreateString({ data, placeholders });

  if (str.match(regExp)) {
    return count + 1;
  }

  if (depth >= maxDepth) {
    return count;
  }

  for (const variant of variants) {
    placeholders[Object.keys(placeholders)[depth]] = variant;

    count += countIt({ ...props, depth: depth + 1 });
  }

  return count;
};

const bootstrap = (input) => {
  const lines = input.split('\n').map((line) => {
    const [dataRaw, cvcRaw] = line.split(' ');

    const data = dataRaw.split('');
    const cvc = cvcRaw.split(',').map(Number);
    const placeholders = data.reduce(
      (prev, char, idx) => ({
        ...prev,
        ...(char === '?' ? { [idx]: variants[0] } : {}),
      }),
      {},
    );
    const maxDepth = Object.keys(placeholders).length;

    return { data, placeholders, cvc, regExp: genRegExp(cvc), maxDepth };
  });

  const result = lines.reduce((prev, line) => {
    const count = countIt(line);
    return prev + count;
  }, 0);

  console.log(result);
};

bootstrap(loadInput('12'));
