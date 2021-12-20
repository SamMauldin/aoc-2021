import { readFileSync } from "fs";
import { resolve } from "path";

const main = () => {
  console.log("~~~ Welcome to Day 20 ~~~");

  const input = readFileSync(
    resolve(__dirname, "../src/day20.txt"),
    "utf8"
  ).trim();

  const [ieaRaw, inputImageRaw] = input.split("\n\n");

  const parseGrid = (grid: string): boolean[][] => {
    return grid.split("\n").map((line) => {
      return line.split("").map((pixel) => pixel === "#");
    });
  };

  const iea = parseGrid(ieaRaw);
  const ieaBits = iea.flat();
  const inputImage = parseGrid(inputImageRaw);

  console.log("~~~ Parsed Input ~~~");

  const visualizeGrid = (grid: boolean[][]) => {
    for (const line of grid) {
      console.log(line.map((pixel) => (pixel ? "#" : ".")).join(""));
    }
  };

  visualizeGrid(iea);
  visualizeGrid(inputImage);

  console.log("~~~ Computing ~~~");

  const enhance = (grid: boolean[][], oob: boolean) => {
    const outputImage: boolean[][] = [];

    for (let y = -1; y <= grid.length; y++) {
      const outputLine: boolean[] = [];

      for (let x = -1; x <= grid[0].length; x++) {
        const strCoords = [
          { x: x - 1, y: y - 1 },
          { x, y: y - 1 },
          { x: x + 1, y: y - 1 },

          { x: x - 1, y },
          { x, y },
          { x: x + 1, y },

          { x: x - 1, y: y + 1 },
          { x, y: y + 1 },
          { x: x + 1, y: y + 1 },
        ];

        const pixelAt = (coord: { x: number; y: number }) => {
          if (coord.x < 0 || coord.y < 0) return oob;
          if (coord.x >= grid[0].length || coord.y >= grid.length) return oob;

          return grid[coord.y][coord.x];
        };

        const pixels = strCoords.map(pixelAt);
        const bits = pixels.map((pixel) => (pixel ? "1" : "0")).join("");
        const digit = parseInt(bits, 2);

        const realPixel = ieaBits[digit];

        outputLine.push(realPixel);
      }

      outputImage.push(outputLine);
    }

    return outputImage;
  };

  let output = inputImage;
  let oob = false;

  for (let i = 0; i < 50; i++) {
    output = enhance(output, oob);

    if (ieaBits[0]) oob = !oob;
  }

  const litPixels: number = output
    .flatMap((line) => line.map((pixel) => (pixel ? 1 : 0)))
    // @ts-ignore
    .reduce((a, b) => a + b);

  console.log("~~~ Results ~~~~");

  console.log(litPixels);

  console.log("~~~ Part Two ~~~");
};

console.log(main());
