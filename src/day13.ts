import { readFileSync } from "fs";
import { resolve } from "path";

const main = () => {
  const input = readFileSync(
    resolve(__dirname, "../src/day13.txt"),
    "utf8"
  ).trim();

  const [dots, instructions] = input.split("\n\n");

  const dotPoses = dots
    .split("\n")
    .map((line) => line.split(",").map((n) => Number(n)));
  const makeFolds = instructions.split("\n").map((line) => {
    const parts = line.split(" ");
    const [plane, coord] = parts[parts.length - 1].split("=");

    return {
      plane,
      coord: Number(coord),
    };
  });

  const matrix = new Set<string>();

  const partOne = () => {
    for (const dot of dotPoses) {
      matrix.add(`${dot[0]},${dot[1]}`);
    }

    for (const { plane, coord } of makeFolds) {
      for (const dot of matrix.values()) {
        const [x, y] = dot.split(",").map((n) => Number(n));

        if (plane === "x" && x > coord) {
          const distFromFold = x - coord;
          const newX = coord - distFromFold;

          matrix.add(`${newX},${y}`);
          matrix.delete(dot);
        } else if (plane === "y" && y > coord) {
          const distFromFold = y - coord;
          const newY = coord - distFromFold;

          matrix.add(`${x},${newY}`);
          matrix.delete(dot);
        }
      }
    }

    for (let line = 0; line < 100; line++) {
      const lineVals = new Array(100).fill(".");
      for (const dot of matrix.values()) {
        const [x, y] = dot.split(",").map((n) => Number(n));

        if (y !== line) continue;

        lineVals[x] = "#";
      }

      console.log(lineVals.join(""));
    }

    return matrix.size;
  };

  const partTwo = () => {};

  return {
    partOne: partOne(),
    partTwo: partTwo(),
  };
};

console.log(main());
