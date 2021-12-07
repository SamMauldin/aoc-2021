import { readFileSync } from "fs";
import { resolve } from "path";

const main = () => {
  const input = readFileSync(
    resolve(__dirname, "../src/day7.txt"),
    "utf8"
  ).trim();

  const parsed = input.split(",").map((pos) => {
    return Number(pos);
  });

  const maxPos = parsed.reduce((a, b) => Math.max(a, b), 0);

  const fuelCost = (pos: number) => {
    let totalCost = 0;

    for (const currPos of parsed) {
      const dist = Math.abs(pos - currPos);

      if (dist === 0) continue;

      let moveCost = 0;
      for (let i = 0; i < dist; i++) {
        moveCost += i + 1;
      }

      totalCost += moveCost;
    }

    return totalCost;
  };

  const partOne = () => {
    let minCost = Infinity;
    for (let i = 0; i < maxPos; i++) {
      const thisPosCost = fuelCost(i);

      if (minCost > thisPosCost) {
        minCost = thisPosCost;
      }
    }

    return minCost;
  };

  const partTwo = () => {};

  return {
    partOne: partOne(),
    partTwo: partTwo(),
  };
};

console.log(main());
