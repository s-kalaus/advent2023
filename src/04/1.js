import { loadInput } from '../utils/load-input.js';

const calcPoints = (wins) =>
  wins > 1 ? new Array(wins - 1).fill(null).reduce((prev) => prev * 2, 1) : 1;

const bootstrap = (input) => {
  const { cards, wins } = input
    .trim()
    .split('\n')
    .reduce(
      (prev, line) => {
        const [, item] = line.replace(/ {2}/g, ' ').split(': ');
        const [cards, wins] = item.trim().split('|');
        return {
          cards: [
            ...prev.cards,
            cards
              .trim()
              .split(' ')
              .map((i) => +i.trim()),
          ],
          wins: [
            ...prev.wins,
            wins
              .trim()
              .split(' ')
              .map((i) => +i.trim()),
          ],
        };
      },
      { cards: [], wins: [] },
    );

  const original = cards.map(
    (card, idx) => card.filter((c) => wins[idx].includes(c)).length,
    0,
  );

  const result = original.reduce(
    (prev, wins) => prev + (wins > 0 ? calcPoints(wins) : 0),
    0,
  );

  console.log(result);
};

bootstrap(loadInput('04'));
