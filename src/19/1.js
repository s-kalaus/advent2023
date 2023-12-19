import { loadInput } from '../utils/load-input.js';

const signActions = {
  '<': (a, b) => a < b,
  '>': (a, b) => a > b,
};

const bootstrap = (input) => {
  const [workflowsRaw, ratingsRaw] = input.split('\n\n');

  const workflows = workflowsRaw.split('\n').reduce(
    (prev, line) => {
      const [, addr, rulesRaw] = line.trim().match(/^([^{]+)\{([^}]+)}$/);

      const rules = rulesRaw.split(',').map((rule) => {
        const [conditionRaw, result] = rule.split(':');

        if (!result) {
          return { result: conditionRaw };
        }

        const [, attr, sign, value] = conditionRaw.match(
          /^([a-z]+)([<>])(\d+)$/,
        );

        return {
          condition: { attr, sign, value: +value },
          result,
        };
      });

      return { ...prev, [addr]: rules };
    },
    {
      A: [
        {
          action: (attrs) =>
            Object.values(attrs).reduce((prev, value) => prev + value, 0),
        },
      ],
      R: [
        {
          action: () => 0,
        },
      ],
    },
  );

  const queue = ratingsRaw.split('\n').reduce((prev, line) => {
    const parts = line
      .replace(/[{}]/g, '')
      .split(',')
      .reduce(
        (prev, part) => {
          const [attr, value] = part.split('=');
          return { ...prev, [attr]: +value };
        },
        { workflow: 'in' },
      );

    return [...prev, parts];
  }, []);

  let out = 0;

  while (queue.length) {
    const task = queue.shift();
    const { workflow, ...attrs } = task;
    const rules = workflows[workflow];

    for (const { action, condition, result } of rules) {
      if (action) {
        out += action(attrs);
        break;
      } else if (condition) {
        const { attr, sign, value } = condition;

        if (signActions[sign](attrs[attr], value)) {
          queue.push({ workflow: result, ...attrs });
          break;
        }
      } else {
        queue.push({ workflow: result, ...attrs });
      }
    }
  }

  console.log(out);
};

bootstrap(loadInput('19'));
