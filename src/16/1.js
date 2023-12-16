import { loadInput } from '../utils/load-input.js';

const bootstrap = (input) => {
  const data = input.split('\n').map((line) => line.split(''));
  const visited = {};
  const visitedVectors = {};
  const beams = [{ x: 0, y: 0, d: 'E' }];
  const progs = {
    '/': {
      E: (beam) => {
        beam.d = 'N';
        progsDir[beam.d](beam);
      },
      N: (beam) => {
        beam.d = 'E';
        progsDir[beam.d](beam);
      },
      W: (beam) => {
        beam.d = 'S';
        progsDir[beam.d](beam);
      },
      S: (beam) => {
        beam.d = 'W';
        progsDir[beam.d](beam);
      },
    },
    '\\': {
      E: (beam) => {
        beam.d = 'S';
        progsDir[beam.d](beam);
      },
      N: (beam) => {
        beam.d = 'W';
        progsDir[beam.d](beam);
      },
      W: (beam) => {
        beam.d = 'N';
        progsDir[beam.d](beam);
      },
      S: (beam) => {
        beam.d = 'E';
        progsDir[beam.d](beam);
      },
    },
    '|': {
      E: (beam) => {
        beam.d = 'S';
        progsDir[beam.d](beam);
        beams.push({ x: beam.x, y: beam.y, d: 'N' });
        const nBeam = beams[beams.length - 1];
        progsDir[nBeam.d](nBeam);
      },
      W: (beam) => {
        beam.d = 'N';
        progsDir[beam.d](beam);
        beams.push({ x: beam.x, y: beam.y, d: 'S' });
        const nBeam = beams[beams.length - 1];
        progsDir[nBeam.d](nBeam);
      },
    },
    '-': {
      N: (beam) => {
        beam.d = 'E';
        progsDir[beam.d](beam);
        beams.push({ x: beam.x, y: beam.y, d: 'W' });
        const nBeam = beams[beams.length - 1];
        progsDir[nBeam.d](nBeam);
      },
      S: (beam) => {
        beam.d = 'W';
        progsDir[beam.d](beam);
        beams.push({ x: beam.x, y: beam.y, d: 'E' });
        const nBeam = beams[beams.length - 1];
        progsDir[nBeam.d](nBeam);
      },
    },
  };
  const progsDir = {
    E: (beam) => (beam.x += 1),
    N: (beam) => (beam.y -= 1),
    W: (beam) => (beam.x -= 1),
    S: (beam) => (beam.y += 1),
  };

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

      if (progs[data[y][x]]?.[d]) {
        progs[data[y][x]][d](beam);
      } else {
        progsDir[d](beam);
      }
    }
  }

  const result = Object.keys(visited).length;

  console.log(result);
};

bootstrap(loadInput('16'));
