import { loadInput } from '../utils/load-input.js';

const angleMap = {
  '2,2': { 1: -1, 3: 1 },
  '0,0': { 1: 1, 3: -1 },

  '0,1': { 0: -1, 3: -1 },
  '3,2': { 0: 1, 3: 1 },

  '0,3': { 0: 1, 1: 1 },
  '1,2': { 0: -1, 1: -1 },

  '2,1': { 2: 1, 3: 1 },
  '3,0': { 2: -1, 3: -1 },

  '2,3': { 1: -1, 2: -1 },
  '1,0': { 1: 1, 2: 1 },

  '1,1': { 0: -1, 2: 1 },
  '3,3': { 0: 1, 2: -1 },
};

const directions = {
  '|': [['F', '7', '|'], [], ['L', 'J', '|'], []],
  '-': [[], ['7', 'J', '-'], [], ['F', 'L', '-']],
  L: [['|', 'F', '7'], ['-', 'J', '7'], [], []],
  J: [['|', '7', 'F'], [], [], ['-', 'L', 'F']],
  7: [[], [], ['|', 'L', 'J'], ['-', 'F', 'L']],
  F: [[], ['-', '7', 'J'], ['|', 'L', 'J'], []],
};

const angle = {
  0: [0, -1],
  1: [1, 0],
  2: [0, 1],
  3: [-1, 0],
};

const angleReverse = { 0: 2, 1: 3, 2: 0, 3: 1 };

const angleRev = {
  '0,-1': 0,
  '1,0': 1,
  '0,1': 2,
  '-1,0': 3,
};

const findNext = (data, x, y, prev, expected = 1) => {
  const result = [];
  const current = data[y][x];
  const [px, py] = prev;

  for (const i in angle) {
    const [dx, dy] = angle[i];
    const nx = x + dx;
    const ny = y + dy;

    const next = data[ny]?.[nx];

    if (
      next !== '.' &&
      (expected === 2 || next !== 'S') &&
      !(nx === px && ny === py) &&
      directions[current]?.[i].includes(next)
    ) {
      result.push([nx, ny]);
    }

    if (result.length >= expected) {
      break;
    }
  }

  return result;
};

const findFirst = (data, x, y) => {
  const result = [];

  for (const i in angle) {
    const [dx, dy] = angle[i];
    const nx = x + dx;
    const ny = y + dy;
    const next = data[ny]?.[nx];

    if (directions[next][angleReverse[i]].length) {
      result.push([nx, ny]);
    }
  }

  return result;
};

const k = (x, y) => `${x},${y}`;

const searchLeftsRights = ({ vertices, x, y, anglePrev, angleNext }) => {
  const dirs = {};

  const map = angleMap[`${anglePrev},${angleNext}`];

  for (const i in angle) {
    const [dx, dy] = angle[i];
    const nx = x + dx;
    const ny = y + dy;

    if (`${nx},${ny}` in vertices) {
      continue;
    }

    dirs[i] = [nx, ny];
  }

  return Object.entries(dirs).reduce(
    (prev, [dir, value]) => ({
      left: [...prev.left, ...(map[dir] === 1 ? [] : [value])],
      right: [...prev.right, ...(map[dir] === 1 ? [value] : [])],
    }),
    { left: [], right: [] },
  );
};

const searchEdges = ({ vertices, x, y, prev, width, height, walked = {} }) => {
  const [px, py] = prev;

  for (const i in angle) {
    const [dx, dy] = angle[i];
    const nx = x + dx;
    const ny = y + dy;

    if (nx < 0 || nx >= width) {
      return true;
    }

    if (ny < 0 || ny >= height) {
      return true;
    }

    if (`${nx},${ny}` in vertices) {
      continue;
    }

    if (`${nx},${ny}` in walked) {
      continue;
    }

    if (px === nx && py === ny) {
      continue;
    }

    walked[k(nx, ny)] = true;

    return searchEdges({
      vertices,
      x: nx,
      y: ny,
      prev: [x, y],
      width,
      height,
      walked,
    });
  }

  return false;
};

const walkEdges = ({ vertices, x, y, prev, width, height, walked = {} }) => {
  const [px, py] = prev;

  walked[k(x, y)] = true;

  for (const i in angle) {
    const [dx, dy] = angle[i];
    const nx = x + dx;
    const ny = y + dy;

    if (nx < 0 || nx >= width) {
      return true;
    }

    if (ny < 0 || ny >= height) {
      return true;
    }

    if (`${nx},${ny}` in vertices) {
      continue;
    }

    if (`${nx},${ny}` in walked) {
      continue;
    }

    if (px === nx && py === ny) {
      continue;
    }

    return walkEdges({
      vertices,
      x: nx,
      y: ny,
      prev: [x, y],
      width,
      height,
      walked,
    });
  }

  return walked;
};

const bootstrap = (input) => {
  let start = [0, 0];

  const data = input.split('\n').reduce(
    (prev, row, y) => [
      ...prev,
      row.split('').map((v, x) => {
        if (v === 'S') {
          start = [x, y];
        }

        return v;
      }),
    ],
    [],
  );

  const height = data.length;
  const width = data[0].length;

  let [right, left] = findFirst(data, start[0], start[1]);
  let lPrev = start;
  let rPrev = start;
  let steps = 1;

  const vertices = { [k(...start)]: [...start, data[start[1]][start[0]]] };
  const lPipe = [start];
  const rPipe = [];

  while (true) {
    const [xl, yl] = left;
    const [xr, yr] = right;

    [left] = findNext(data, xl, yl, lPrev);
    [right] = findNext(data, xr, yr, rPrev);

    vertices[k(xl, yl)] = [xl, yl, data[yl][xl]];
    vertices[k(xr, yr)] = [xr, yr, data[yr][xr]];

    const isSame = xl === xr && yl === yr;
    const isX = xl === xr && Math.abs(yl - yr) === 1;
    const isY = Math.abs(xl - xr) === 1 && yl === yr;

    if (isSame || isX || isY) {
      if (isSame) {
        lPipe.push([xl, yl]);
      }

      break;
    }

    lPipe.push([xl, yl]);
    rPipe.unshift([xr, yr]);

    lPrev = [xl, yl];
    rPrev = [xr, yr];

    steps += 1;
  }

  const pipe = [...lPipe, ...rPipe];
  const lefts = [];
  const rights = [];

  pipe.forEach(([x, y], idx) => {
    const dx0 = x - (pipe[idx - 1] ?? pipe[pipe.length - 1])[0];
    const dy0 = y - (pipe[idx - 1] ?? pipe[pipe.length - 1])[1];

    const dx1 = (pipe[idx + 1] ?? pipe[0])[0] - x;
    const dy1 = (pipe[idx + 1] ?? pipe[0])[1] - y;

    const anglePrev = angleRev[`${dx0},${dy0}`];
    const angleNext = angleRev[`${dx1},${dy1}`];

    const { left, right } = searchLeftsRights({
      data,
      vertices,
      x,
      y,
      idx,
      anglePrev,
      angleNext,
    });

    lefts.push(...left);
    rights.push(...right);
  });

  const hasEdgeInLefts = lefts.some(([x, y]) =>
    searchEdges({ vertices, x, y, prev: [-1, -1], width, height }),
  );

  const walked = {};

  (hasEdgeInLefts ? rights : lefts).forEach(([x, y]) => {
    walkEdges({
      vertices,
      x,
      y,
      prev: [-1, -1],
      width,
      height,
      walked,
    });
  });

  const result = Object.keys(walked).length;

  console.log(result);
};

bootstrap(loadInput('10'));
