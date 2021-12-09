import { readFileSync } from "fs";
import { resolve } from "path";

const main = () => {
  const input = readFileSync(
    resolve(__dirname, "../src/day9.txt"),
    "utf8"
  ).trim();

  const heightMap = input.split("\n").map((line) => {
    return line.split("").map((n) => Number(n));
  });

  const neighbors = (x: number, y: number) => {
    return [
      x !== 0 && heightMap[x - 1][y],
      y !== 0 && heightMap[x][y - 1],
      x !== heightMap.length - 1 && heightMap[x + 1][y],
      y !== heightMap[0].length - 1 && heightMap[x][y + 1],
    ].filter((n) => n !== false);
  };

  const neighborPos = (x: number, y: number) => {
    return [
      x !== 0 && { x: x - 1, y },
      y !== 0 && { x, y: y - 1 },
      x !== heightMap.length - 1 && { x: x + 1, y },
      y !== heightMap[0].length - 1 && { x, y: y + 1 },
    ].filter((n) => n !== false);
  };

  const partOne = () => {
    let riskSum = 0;

    for (let x = 0; x < heightMap.length; x++) {
      for (let y = 0; y < heightMap[0].length; y++) {
        const height = heightMap[x][y];

        const adaj = neighbors(x, y);

        const lowPoint = adaj.every((aHeight) => height < aHeight);

        if (lowPoint) {
          riskSum += height + 1;
        }
      }
    }

    return riskSum;
  };

  const partTwo = () => {
    const lowPoints: { x: number; y: number }[] = [];

    for (let x = 0; x < heightMap.length; x++) {
      for (let y = 0; y < heightMap[0].length; y++) {
        const height = heightMap[x][y];

        const adaj = neighbors(x, y);

        const lowPoint = adaj.every((aHeight) => height < aHeight);

        if (lowPoint) {
          lowPoints.push({ x, y });
        }
      }
    }

    const basinSizes: number[] = [];

    const basinSize = (x: number, y: number, visited: Set<string>): number => {
      let size = 1;

      for (const neighbor of neighborPos(x, y)) {
        if (neighbor === false) continue;
        if (visited.has(neighbor.x + "," + neighbor.y)) continue;

        visited.add(neighbor.x + "," + neighbor.y);

        const height = heightMap[neighbor.x][neighbor.y];

        if (height === 9) continue;

        size += basinSize(neighbor.x, neighbor.y, visited);
      }

      return size;
    };

    for (const lowPoint of lowPoints) {
      basinSizes.push(
        basinSize(
          lowPoint.x,
          lowPoint.y,
          new Set([lowPoint.x + "," + lowPoint.y])
        )
      );
    }

    basinSizes.sort((a, b) => b - a);

    console.log(basinSizes);

    return basinSizes[0] * basinSizes[1] * basinSizes[2];
  };

  return {
    partOne: partOne(),
    partTwo: partTwo(),
  };
};

console.log(main());
