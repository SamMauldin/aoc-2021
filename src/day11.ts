import { readFileSync } from "fs";
import { resolve } from "path";

const main = () => {
  const input = readFileSync(
    resolve(__dirname, "../src/day11.txt"),
    "utf8"
  ).trim();

  const parsed = input.split("\n").map((line) => {
    return line.split("").map((n) => Number(n));
  });

  const posStr = (x: number, y: number) => `${x},${y}`;

  const neighborPos = (x: number, y: number) => {
    return [
      x !== 0 && { x: x - 1, y },
      y !== 0 && { x, y: y - 1 },
      x !== parsed.length - 1 && { x: x + 1, y },
      y !== parsed[0].length - 1 && { x, y: y + 1 },

      // Diagonals
      x !== 0 && y !== 0 && { x: x - 1, y: y - 1 },
      x !== parsed.length - 1 && y !== 0 && { x: x + 1, y: y - 1 },
      x !== 0 && y !== parsed.length - 1 && { x: x - 1, y: y + 1 },
      x !== parsed.length - 1 &&
        y !== parsed.length - 1 && { x: x + 1, y: y + 1 },
    ].filter((n) => n !== false);
  };

  const partOne = () => {
    let flashes = 0;

    for (let i = 0; i < 1000000; i++) {
      let flashed = new Set<string>();

      const flash = (x: number, y: number) => {
        if (flashed.has(posStr(x, y))) return;
        flashed.add(posStr(x, y));

        flashes++;

        for (const pos of neighborPos(x, y)) {
          if (pos === false) continue;

          parsed[pos.x][pos.y]++;
          if (parsed[pos.x][pos.y] > 9) {
            flash(pos.x, pos.y);
          }
        }
      };

      for (let x = 0; x < parsed.length; x++) {
        for (let y = 0; y < parsed.length; y++) {
          parsed[x][y]++;
        }
      }

      for (let x = 0; x < parsed.length; x++) {
        for (let y = 0; y < parsed.length; y++) {
          if (parsed[x][y] > 9) {
            flash(x, y);
          }
        }
      }

      for (let x = 0; x < parsed.length; x++) {
        for (let y = 0; y < parsed.length; y++) {
          if (parsed[x][y] > 9) {
            parsed[x][y] = 0;
          }
        }
      }

      if (flashed.size === parsed.length * parsed[0].length) {
        console.log(i);
        process.exit(0);
      }
    }

    return flashes;
  };

  const partTwo = () => {};

  return {
    partOne: partOne(),
    partTwo: partTwo(),
  };
};

console.log(main());
