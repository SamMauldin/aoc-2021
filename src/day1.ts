import { readFileSync } from "fs";
import { resolve } from "path";

const partOne = (depths: number[]) => {
  let increases = 0;
  let lastDepth = Infinity;

  for (const depth of depths) {
    if (depth > lastDepth) increases++;

    lastDepth = depth;
  }

  return increases;
};

const partTwo = (depths: number[]) => {
  let increases = 0;
  let counter = depths[0] + depths[1] + depths[2];

  for (let i = 3; i < depths.length; i++) {
    let depth = depths[i];

    let newCounter = counter + depth - depths[i - 3];

    if (newCounter > counter) increases++;

    counter = newCounter;
  }

  return increases;
};

const main = () => {
  const input = readFileSync(
    resolve(__dirname, "../src/day1.txt"),
    "utf8"
  ).trim();

  const depths = input.split("\n").map((depth) => parseInt(depth));

  return {
    partOne: partOne(depths),
    partTwo: partTwo(depths),
  };
};

console.log(main());
