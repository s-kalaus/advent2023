import { loadInput } from '../utils/load-input.js';

const bootstrap = (input) => {
  let original = input.split('\n').map((line) => {
    const [cardsRaw, winnersRaw] = line.replace(/.*?:/, '').split('|');
    const numbers = cardsRaw.split(' ').filter(Boolean).map(Number);
    const winners = winnersRaw.split(' ').filter(Boolean).map(Number);
    const wins = numbers.filter((num) => winners.includes(num)).length;
    return { wins, copies: 1 };
  });

  const result = original.reduce((prev, { wins, copies }, idx) => {
    new Array(wins).fill(null).forEach((_, i) => {
      original[idx + 1 + i].copies += copies;
    });
    return prev + copies;
  }, 0);

  console.log(result);
};

bootstrap(loadInput('04'));
