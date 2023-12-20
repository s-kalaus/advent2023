import { loadInput } from '../utils/load-input.js';

const bootstrap = (input) => {
  const data = input.split('\n').reduce((prev, line) => {
    const [sourceRaw, targetRaw] = line.split(' -> ');

    const sourceMatch = sourceRaw.match(/^([%&])(.+)$/);
    let source = sourceRaw;
    let type = null;

    if (sourceMatch) {
      source = sourceMatch[2];
      type = sourceMatch[1];
    }

    const targets = targetRaw.split(', ');

    return { ...prev, [source]: { type, inputs: {}, targets, state: false } };
  }, {});

  Object.entries(data)
    .filter(([_, module]) => module.type === '&')
    .forEach(([source, module]) => {
      module.inputs = Object.entries(data).reduce(
        (prev, [theSource, { targets }]) => ({
          ...prev,
          ...(targets.includes(source) && { [theSource]: 'low' }),
        }),
        {},
      );
    });

  let steps = 0;
  let routes = {};
  let cursor = 'rx';
  let levels = 0;

  while (Object.keys(routes).length < 2) {
    routes = {};

    Object.entries(data).forEach(([source, { type, targets }]) => {
      if (targets.includes(cursor)) {
        routes[source] = null;
      }
    });

    const keys = Object.keys(routes);

    if (keys.length) {
      cursor = keys[0];
      levels += 1;

      if (levels > 2) {
        throw new Error('too many levels, need a real solution');
      }
    }
  }

  const go = ({ queue }) => {
    while (queue.length) {
      const { target, signal, from } = queue.shift();

      const module = data[target];

      if (!module) {
        continue;
      }

      if (from in routes && routes[from] === null && signal === 'high') {
        routes[from] = steps;
        continue;
      }

      if (module.type === '%') {
        // flip-flop
        if (signal === 'low') {
          module.state = !module.state;

          module.targets.forEach((theTarget) =>
            queue.push({
              target: theTarget,
              signal: module.state ? 'high' : 'low',
              from: target,
            }),
          );
        }
        //
      } else if (module.type === '&') {
        // conjunction
        module.inputs[from] = signal;

        const allHigh = Object.values(module.inputs).every(
          (input) => input === 'high',
        );

        module.targets.forEach((theTarget) =>
          queue.push({
            target: theTarget,
            signal: allHigh ? 'low' : 'high',
            from: target,
          }),
        );
      } else {
        // broadcaster
        for (const theTarget of module.targets) {
          queue.push({ target: theTarget, signal, from: target });
        }
      }
    }
  };

  while (!Object.values(routes).every((steps) => steps !== null)) {
    const queue = [{ target: 'broadcaster', signal: 'low', from: null }];

    steps += 1;

    go({ queue });
  }

  const result = Object.values(routes).reduce(
    (prev, current) => prev * current,
    1,
  );

  console.log(result);
};

bootstrap(loadInput('20'));
