import { loadInput } from '../utils/load-input.js';

const RANGE = [1, 4000];

const bootstrap = (input) => {
  const [workflowsRaw, ratingsRaw] = input.split('\n\n');

  const workflows = workflowsRaw.split('\n').reduce((prev, line) => {
    const [, addr, rulesRaw] = line.trim().match(/^([^{]+)\{([^}]+)}$/);

    const rules = rulesRaw.split(',').map((rule) => {
      const [conditionRaw, result] = rule.split(':');

      if (!result) {
        return { result: conditionRaw };
      }

      const [, attr, sign, value] = conditionRaw.match(/^([a-z]+)([<>])(\d+)$/);

      return {
        condition: { attr, sign, value: +value },
        result,
      };
    });

    return { ...prev, [addr]: rules };
  }, {});

  const ranges = {
    x: [...RANGE],
    m: [...RANGE],
    a: [...RANGE],
    s: [...RANGE],
  };

  const variations = { in: { name: 'in', children: {} } };
  const validPaths = [];

  const go = ({ name, paths }) => {
    let rules = workflows[name];

    const isTerminal = rules.every(({ result }) => ['A'].includes(result));
    const hasUnconditionalA = rules.some(
      ({ result, condition }) => result === 'A' && !condition,
    );

    rules = rules.filter(({ result, condition }) =>
      hasUnconditionalA && isTerminal ? result === 'A' && !condition : true,
    );

    let conditions = [];

    for (const { condition, result } of rules) {
      let deep = true;

      if (result === 'A') {
        let current = paths;
        const p = [
          {
            name: result,
            conditions: [...conditions, ...(condition ? [condition] : [])],
          },
        ];

        while (current.parent) {
          p.unshift(current);

          current = current.parent;
        }

        const r = { ...ranges };

        for (const step of p) {
          if (step.conditions.length) {
            for (const c of step.conditions) {
              const { attr, sign, value } = c;

              if (sign === '>') {
                r[attr] = [value + 1, r[attr][1]];
              }

              if (sign === '<') {
                r[attr] = [r[attr][0], value - 1];
              }
            }
          }
        }

        validPaths.push({
          p: p.reduce(
            (prev, _) => ({ ...prev, [_.name]: JSON.stringify(_.conditions) }),
            {},
          ),
          r,
        });

        deep = false;
      } else if (result === 'R') {
        deep = false;
      }

      if (deep) {
        paths.children[result] = {
          parent: paths,
          name: result,
          conditions: [...conditions, ...(condition ? [condition] : [])],
          children: {},
        };

        go({ name: result, paths: paths.children[result] });
      }

      if (condition) {
        conditions = [
          ...conditions,
          {
            ...condition,
            ...(condition.sign === '>'
              ? { sign: '<', value: condition.value + 1 }
              : { sign: '>', value: condition.value - 1 }),
          },
        ];
      }
    }
  };

  go({ name: 'in', paths: variations.in });

  const result = validPaths.reduce((prev, { r }) => {
    return (
      prev +
      Object.values(r).reduce((prev, [min, max]) => prev * (max - min + 1), 1)
    );
  }, 0);

  console.log(result);
};

bootstrap(loadInput('19'));
