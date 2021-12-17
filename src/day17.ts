import { readFileSync } from "fs";
import { resolve } from "path";

const main = () => {
  const input = readFileSync(
    resolve(__dirname, "../src/day17.txt"),
    "utf8"
  ).trim();

  const [xPartRaw, yPartRaw] = input.split(", ");
  const [, xRange] = xPartRaw.split("=");
  const [, yRange] = yPartRaw.split("=");

  const [minX, maxX] = xRange.split("..").map((n) => Number(n));
  const [minY, maxY] = yRange.split("..").map((n) => Number(n));

  type LaunchConfig = {
    targetX: [number, number];
    targetY: [number, number];
  };

  const matches = (
    startXVel: number,
    startYVel: number
  ): false | { maxReachedY: number } => {
    let maxReachedY = -Infinity;

    let x = 0;
    let y = 0;
    let xVel = startXVel;
    let yVel = startYVel;

    while (true) {
      x += xVel;
      y += yVel;

      if (xVel > 0) {
        xVel--;
      } else if (xVel < 0) {
        xVel++;
      }

      yVel--;

      maxReachedY = Math.max(maxReachedY, y);

      if (x > maxX || (y < minY && yVel <= 0)) return false;
      if (x >= minX && x <= maxX && y >= minY && y <= maxY)
        return { maxReachedY };
    }
  };

  let maxMatchedY = -Infinity;
  let matchedValues = 0;

  for (let xVelCandidate = 0; xVelCandidate <= maxX; xVelCandidate++) {
    for (
      let yVelCandidate = -Math.max(Math.abs(minY), Math.abs(maxY));
      yVelCandidate <= 500;
      yVelCandidate++
    ) {
      const match = matches(xVelCandidate, yVelCandidate);

      if (match) {
        matchedValues++;
        console.log(`Match for ${xVelCandidate},${yVelCandidate}`, match);
        maxMatchedY = Math.max(maxMatchedY, match.maxReachedY);
      }
    }
  }

  console.log(maxMatchedY, matchedValues);
};

console.log(main());
