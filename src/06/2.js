import { loadInput } from '../utils/load-input.js';

const bootstrap = (input) => {
  const [timesRaw, distancesRaw] = input.split('\n');
  const times = [+timesRaw.replace(/^.*?: /, '').replace(/ {2,}/g, '')];
  const distances = [+distancesRaw.replace(/^.*?: /, '').replace(/ {2,}/g, '')];

  const calcVariants = (maxTime, maxDistance) => {
    let chargingTime = 0;
    let minSpeed = 0;
    let maxSpeed = 0;

    while (minSpeed === 0) {
      const raceTime = maxTime - chargingTime;
      const distance = raceTime * chargingTime;

      if (distance > maxDistance) {
        minSpeed = chargingTime;
      }

      chargingTime += 1;
    }

    while (maxSpeed === 0) {
      const raceTime = maxTime - chargingTime;
      const distance = raceTime * chargingTime;

      if (distance <= maxDistance) {
        maxSpeed = chargingTime - 1;
      }

      chargingTime += 1;
    }

    return maxSpeed - minSpeed + 1;
  };

  const result = times.reduce(
    (prev, time, idx) => prev * calcVariants(time, distances[idx]),
    1,
  );

  console.log(result);
};

bootstrap(loadInput('06'));
