import { readFileSync } from "fs";
import { resolve } from "path";

const main = () => {
  console.log("~~~ Welcome to Day 22 ~~~");

  const input = readFileSync(
    resolve(__dirname, "../src/day22.txt"),
    "utf8"
  ).trim();

  type Cube = {
    x: [number, number];
    y: [number, number];
    z: [number, number];
  };

  const executionSteps: { cube: Cube; instruction: "on" | "off" }[] = input
    .split("\n")
    .map((step) => {
      const [instructionRaw, xRangeRaw, yRangeRaw, zRangeRaw] = step.split("=");
      const instruction = instructionRaw.split(" ")[0] as "on" | "off";
      const [xRangeRaw2] = xRangeRaw.split(",");
      const [xStart, xEnd] = xRangeRaw2.split("..").map((n) => Number(n));

      const [yRangeRaw2] = yRangeRaw.split(",");

      const [yStart, yEnd] = yRangeRaw2.split("..").map((n) => Number(n));

      const [zStart, zEnd] = zRangeRaw.split("..").map((n) => Number(n));

      return {
        instruction,
        cube: {
          x: [xStart, xEnd + 1],
          y: [yStart, yEnd + 1],
          z: [zStart, zEnd + 1],
        },
      };
    });

  console.log("~~~ Parsed Input ~~~");

  console.log(executionSteps);

  console.log("~~~ Computing ~~~");

  const cubeVolume = (cube: Cube): bigint => {
    return (
      BigInt(cube.x[1] - cube.x[0]) *
      BigInt(cube.y[1] - cube.y[0]) *
      BigInt(cube.z[1] - cube.z[0])
    );
  };

  const cubeContains = (container: Cube, containee: Cube): boolean => {
    return (
      container.x[0] <= containee.x[0] &&
      container.x[1] >= containee.x[1] &&
      container.y[0] <= containee.y[0] &&
      container.y[1] >= containee.y[1] &&
      container.z[0] <= containee.z[0] &&
      container.z[1] >= containee.z[1]
    );
  };

  const cubeIntersects = (a: Cube, b: Cube): boolean => {
    return (
      a.x[0] <= b.x[1] &&
      a.x[1] >= b.x[0] &&
      a.y[0] <= b.y[1] &&
      a.y[1] >= b.y[0] &&
      a.z[0] <= b.z[1] &&
      a.z[1] >= b.z[0]
    );
  };

  const cubeSubtract = (existing: Cube, b: Cube): Cube[] => {
    if (!cubeIntersects(existing, b)) return [existing];
    if (cubeContains(b, existing)) return [];

    let innerCubes: Cube[] = [];

    const xInnerSegments = [b.x[0], b.x[1]].filter(
      (x) => existing.x[0] < x && existing.x[1] > x
    );
    const yInnerSegments = [b.y[0], b.y[1]].filter(
      (y) => existing.y[0] < y && existing.y[1] > y
    );
    const zInnerSegments = [b.z[0], b.z[1]].filter(
      (z) => existing.z[0] < z && existing.z[1] > z
    );

    const xSegments = [existing.x[0], ...xInnerSegments, existing.x[1]];
    const ySegments = [existing.y[0], ...yInnerSegments, existing.y[1]];
    const zSegments = [existing.z[0], ...zInnerSegments, existing.z[1]];

    for (let ix = 0; ix < xSegments.length - 1; ix++) {
      const x: [number, number] = [xSegments[ix], xSegments[ix + 1]];
      for (let iy = 0; iy < ySegments.length - 1; iy++) {
        const y: [number, number] = [ySegments[iy], ySegments[iy + 1]];
        for (let iz = 0; iz < zSegments.length - 1; iz++) {
          const z: [number, number] = [zSegments[iz], zSegments[iz + 1]];

          innerCubes.push({ x, y, z });
        }
      }
    }

    return innerCubes.filter((c) => !cubeContains(b, c));
  };

  let cubes: Cube[] = [];

  for (const { cube, instruction } of executionSteps) {
    cubes = cubes.flatMap((existing) => cubeSubtract(existing, cube));

    if (instruction === "on") {
      cubes.push(cube);
    }
  }

  const volume = cubes.map(cubeVolume).reduce((a, b) => a + b);

  console.log("~~~ Results ~~~~");

  console.log(volume);

  console.log("~~~ Part Two ~~~");
};

console.log(main());
