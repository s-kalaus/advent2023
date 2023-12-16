import { loadInput } from '../utils/load-input.js';

const progsMirrors = {
  '/': {
    E: (beam) => (beam.d = 'N'),
    N: (beam) => (beam.d = 'E'),
    W: (beam) => (beam.d = 'S'),
    S: (beam) => (beam.d = 'W'),
  },
  '\\': {
    E: (beam) => (beam.d = 'S'),
    N: (beam) => (beam.d = 'W'),
    W: (beam) => (beam.d = 'N'),
    S: (beam) => (beam.d = 'E'),
  },
};

const progsSPlitters = {
  '|': {
    E: (beam, beams) => {
      beam.d = 'S';
      beams.push({ x: beam.x, y: beam.y, d: 'N' });
    },
    W: (beam, beams) => {
      beam.d = 'N';
      beams.push({ x: beam.x, y: beam.y, d: 'S' });
    },
  },
  '-': {
    N: (beam, beams) => {
      beam.d = 'E';
      beams.push({ x: beam.x, y: beam.y, d: 'W' });
    },
    S: (beam, beams) => {
      beam.d = 'W';
      beams.push({ x: beam.x, y: beam.y, d: 'E' });
    },
  },
};

const progsDir = {
  E: (beam) => (beam.x += 1),
  N: (beam) => (beam.y -= 1),
  W: (beam) => (beam.x -= 1),
  S: (beam) => (beam.y += 1),
};

const bootstrap = (input) => {
  const data = input.split('\n').map((line) => line.split(''));

  const width = data[0].length;
  const height = data.length;

  const beamsStart = [
    ...data.reduce(
      (prev, _, y) => [
        ...prev,
        { x: 0, y, d: 'E' },
        { x: width - 1, y, d: 'W' },
      ],
      [],
    ),
    ...data[0].reduce(
      (prev, _, x) => [
        ...prev,
        { x, y: 0, d: 'S' },
        { x, y: height - 1, d: 'N' },
      ],
      [],
    ),
  ];

  const lengths = beamsStart.map((beam) => {
    const beams = [beam];
    const visited = {};
    const visitedVectors = {};

    while (beams.length) {
      for (const beamIndex in beams) {
        const beam = beams[beamIndex];
        const { x, y, d } = beam;

        const key = `${x},${y}`;
        const keyVector = `${key},${d}`;

        if (visitedVectors[keyVector] || !data[y]?.[x]) {
          beams.splice(+beamIndex, 1);
          continue;
        }

        visited[key] = true;
        visitedVectors[keyVector] = true;

        if (progsMirrors[data[y][x]]?.[d]) {
          progsMirrors[data[y][x]][d](beam);
        } else if (progsSPlitters[data[y][x]]?.[d]) {
          progsSPlitters[data[y][x]][d](beam, beams);
          const beamAlt = beams[beams.length - 1];
          progsDir[beamAlt.d](beamAlt);
        }

        progsDir[beam.d](beam);
      }
    }

    return Object.keys(visited).length;
  });

  const result = Math.max(...lengths);

  console.log(result);
};

bootstrap(loadInput('16'));
