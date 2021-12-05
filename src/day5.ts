import { readFileSync } from "fs";
import { resolve } from "path";

const main = () => {
  const input = readFileSync(
    resolve(__dirname, "../src/day5.txt"),
    "utf8"
  ).trim();

  const lines = input.split("\n").map((line) => {
    const [start, finish] = line.split(" -> ");

    const [x1, y1] = start.split(",").map((n) => Number(n));
    const [x2, y2] = finish.split(",").map((n) => Number(n));

    return {
      x1,
      x2,
      y1,
      y2,
    };
  });

  const partOne = () => {
    const points = new Set<string>();
    const intersectingPoints = new Set<string>();

    for (const { x1, x2, y1, y2 } of lines) {
      if (x1 !== x2 && y1 !== y2) continue;

      for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
        for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
          const point = `${x},${y}`;

          if (points.has(point)) {
            intersectingPoints.add(point);
          }

          points.add(point);
        }
      }
    }

    return intersectingPoints.size;
  };

  const partTwo = () => {
    const points = new Set<string>();
    const intersectingPoints = new Set<string>();

    for (const { x1, x2, y1, y2 } of lines) {
      if (x1 !== x2 && y1 !== y2) {
        let x = x1;
        let y = y1;

        const xSmaller = x === Math.min(x1, x2);
        const ySmaller = y === Math.min(y1, y2);

        while (
          x >= Math.min(x1, x2) &&
          x <= Math.max(x1, x2) &&
          y >= Math.min(y1, y2) &&
          y <= Math.max(y1, y2)
        ) {
          const point = `${x},${y}`;

          if (points.has(point)) {
            intersectingPoints.add(point);
          }

          points.add(point);

          if (xSmaller) {
            x++;
          } else {
            x--;
          }

          if (ySmaller) {
            y++;
          } else {
            y--;
          }
        }
      } else {
        for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
          for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
            const point = `${x},${y}`;

            if (points.has(point)) {
              intersectingPoints.add(point);
            }

            points.add(point);
          }
        }
      }
    }

    return intersectingPoints.size;
  };

  return {
    partOne: partOne(),
    partTwo: partTwo(),
  };
};

console.log(main());
