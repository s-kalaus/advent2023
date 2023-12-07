import { loadInput } from '../utils/load-input.js';

const cardsValue = {
  A: 13,
  K: 12,
  Q: 11,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
  J: 1,
};

const getCardParts = (card) =>
  Object.entries(
    card
      .split('')
      .reduce((prev, c) => ({ ...prev, [c]: prev[c] ? prev[c] + 1 : 1 }), {}),
  ).sort(([, a], [, b]) => b - a);

const combinations = {
  7: (parts) => {
    return parts.length === 1;
  },
  6: (parts) => {
    return parts.length === 2 && parts[0][1] === 4;
  },
  5: (parts) => {
    return parts.length === 2 && parts[0][1] === 3;
  },
  4: (parts) => {
    return parts.length === 3 && parts[1][1] === 1;
  },
  3: (parts) => {
    return parts.length === 3 && parts[0][1] === 2 && parts[1][1] === 2;
  },
  2: (parts) => {
    return (
      parts.length === 4 &&
      parts[0][1] === 2 &&
      parts[1][1] === 1 &&
      parts[2][1] === 1
    );
  },
  1: (parts) => {
    return parts.length === 5;
  },
};

const getCardStrength = (card) => {
  while (true) {
    const strength = Object.keys(combinations).find((key) => {
      let parts = getCardParts(card);
      const hasJoker = parts.find(([c]) => c === 'J');

      if (hasJoker) {
        const firstNonJoker = parts.find(([c]) => c !== 'J');
        const cardReplaced = card.replace(
          /J/g,
          firstNonJoker ? firstNonJoker[0] : 'J',
        );

        parts = getCardParts(cardReplaced);
      }

      return combinations[key](parts);
    });

    if (strength) {
      return +strength;
    }
  }
};

const compareCards = (cardA, cardB) => {
  let result = 0;
  let idx = 0;

  while (result === 0) {
    const diff = cardsValue[cardA[idx]] - cardsValue[cardB[idx]];

    if (diff > 0) {
      return 1;
    } else if (diff < 0) {
      return -1;
    }

    idx += 1;
  }

  return '';
};

const bootstrap = (input) => {
  const hands = input.split('\n').map((line) => {
    const [card, bid] = line.split(' ');
    return { bid: +bid, card, strength: getCardStrength(card) };
  }, []);

  const result = hands
    .sort(
      (
        { card: cardA, strength: strengthA },
        { card: cardB, strength: strengthB },
      ) => {
        if (strengthA > strengthB) {
          return 1;
        } else if (strengthA < strengthB) {
          return -1;
        } else {
          return compareCards(cardA, cardB);
        }
      },
    )
    .reduce((prev, { card, bid }, idx) => prev + bid * (idx + 1), 0);

  console.log(result);
};

bootstrap(loadInput('07'));
