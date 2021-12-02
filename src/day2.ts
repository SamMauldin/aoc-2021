import { readFileSync } from "fs";
import { resolve } from "path";

const main = () => {
  const input = readFileSync(
    resolve(__dirname, "../src/day2.txt"),
    "utf8"
  ).trim();

  const parsed = input.split("\n").map((line) => {
    const [command, magnitude] = line.split(" ");

    return { command, magnitude: parseInt(magnitude) };
  });

  const partOne = () => {
    let pos = 0;
    let depth = 0;

    for (const { command, magnitude } of parsed) {
      if (command === "forward") {
        pos += magnitude;
      } else if (command === "down") {
        depth += magnitude;
      } else if (command === "up") {
        depth -= magnitude;
      }
    }

    return depth * pos;
  };

  const partTwo = () => {
    let pos = 0;
    let depth = 0;
    let aim = 0;

    for (const { command, magnitude } of parsed) {
      if (command === "forward") {
        pos += magnitude;
        depth += magnitude * aim;
      } else if (command === "down") {
        aim += magnitude;
      } else if (command === "up") {
        aim -= magnitude;
      }
    }

    return depth * pos;
  };

  return {
    partOne: partOne(),
    partTwo: partTwo(),
  };
};

console.log(main());
