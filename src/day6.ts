import { readFileSync } from "fs";
import { resolve } from "path";

const main = () => {
  const input = readFileSync(
    resolve(__dirname, "../src/day6.txt"),
    "utf8"
  ).trim();

  const parsed = input.split(",").map((num) => Number(num));

  const partOne = () => {
    let fish = parsed;
    for (let i = 0; i < 80; i++) {
      fish = fish.flatMap((daysLeft) => {
        const newDays = daysLeft - 1;

        if (newDays === -1) {
          return [6, 8];
        }

        return [newDays];
      });
    }

    return fish.length;
  };

  const partTwo = () => {
    // [days left]: fish here
    let fish: number[] = [];

    for (const fishAge of parsed) {
      fish[fishAge] = (fish[fishAge] || 0) + 1;
    }

    for (let i = 0; i < 256; i++) {
      console.log(i);

      const readyToBirthFish = fish.shift() || 0;

      fish[6] = (fish[6] || 0) + readyToBirthFish;
      fish[8] = (fish[8] || 0) + readyToBirthFish;
    }

    return fish.reduce((a, b) => a + b, 0);
  };

  return {
    partOne: partOne(),
    partTwo: partTwo(),
  };
};

console.log(main());
