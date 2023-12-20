import { loadInput } from '../utils/load-input.js';

const REPEATS = 1000;

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

  const result = { low: 0, high: 0 };

  for (let i = 0; i < REPEATS; i += 1) {
    const queue = [{ target: 'broadcaster', signal: 'low', from: null }];

    while (queue.length) {
      const { target, signal, from } = queue.shift();

      result[signal] += 1;

      const module = data[target];

      if (!module) {
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
  }

  console.log(result.low * result.high);
};

bootstrap(loadInput('20'));
