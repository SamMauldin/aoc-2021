import { readFileSync } from "fs";
import { resolve } from "path";

const main = () => {
  console.log("~~~ Welcome to Day 19 ~~~");

  const input = readFileSync(
    resolve(__dirname, "../src/day19.txt"),
    "utf8"
  ).trim();

  type Vec3 = { x: number; y: number; z: number };

  const scanners: Vec3[][] = input.split("\n\n").map((scannerRaw) => {
    const [, ...beacons] = scannerRaw.split("\n");
    return beacons.map((beacon) => {
      const [x, y, z] = beacon.split(",").map((n) => Number(n));

      return { x, y, z };
    });
  });

  console.log("~~~ Parsed Input ~~~");

  console.log(scanners);

  console.log("~~~ Computing ~~~");

  const vecEq = (a: Vec3, b: Vec3): boolean => {
    return a.x === b.x && a.y === b.y && a.z === b.z;
  };

  const vecMult = (a: Vec3, b: Vec3): Vec3 => {
    return {
      x: a.x * b.x,
      y: a.y * b.y,
      z: a.z * b.z,
    };
  };

  const ROTATIONS = [
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, -1, 0, 1, 0],
    [1, 0, 0, 0, -1, 0, 0, 0, -1],
    [1, 0, 0, 0, 0, 1, 0, -1, 0],
    [0, -1, 0, 1, 0, 0, 0, 0, 1],
    [0, 0, 1, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 1, 0, 0, 0, 0, -1],
    [0, 0, -1, 1, 0, 0, 0, -1, 0],
    [-1, 0, 0, 0, -1, 0, 0, 0, 1],
    [-1, 0, 0, 0, 0, -1, 0, -1, 0],
    [-1, 0, 0, 0, 1, 0, 0, 0, -1],
    [-1, 0, 0, 0, 0, 1, 0, 1, 0],
    [0, 1, 0, -1, 0, 0, 0, 0, 1],
    [0, 0, 1, -1, 0, 0, 0, -1, 0],
    [0, -1, 0, -1, 0, 0, 0, 0, -1],
    [0, 0, -1, -1, 0, 0, 0, 1, 0],
    [0, 0, -1, 0, 1, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 0, -1, 0, 1, 0, 0],
    [0, -1, 0, 0, 0, -1, 1, 0, 0],
    [0, -1, 0, 0, 0, -1, 1, 0, 0],
    [0, 0, -1, 0, -1, 0, -1, 0, 0],
    [0, -1, 0, 0, 0, 1, -1, 0, 0],
    [0, 0, 1, 0, 1, 0, -1, 0, 0],
    [0, 1, 0, 0, 0, -1, -1, 0, 0],
  ];

  const dotProduct = (a: number[], b: number[]): number => {
    return a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
  };

  const vecRotate = (rotation: number[], a: Vec3): Vec3 => {
    return {
      x: dotProduct([a.x, a.y, a.z], [rotation[0], rotation[1], rotation[2]]),
      y: dotProduct([a.x, a.y, a.z], [rotation[3], rotation[4], rotation[5]]),
      z: dotProduct([a.x, a.y, a.z], [rotation[6], rotation[7], rotation[8]]),
    };
  };

  const vecDiff = (a: Vec3, b: Vec3): Vec3 => {
    return {
      x: a.x - b.x,
      y: a.y - b.y,
      z: a.z - b.z,
    };
  };

  const vecAdd = (a: Vec3, b: Vec3): Vec3 => {
    return {
      x: a.x + b.x,
      y: a.y + b.y,
      z: a.z + b.z,
    };
  };

  const matchesWithOffset = (
    setA: Vec3[],
    setB: Vec3[],
    offset: Vec3
  ): number => {
    let matches = 0;

    for (const b of setB) {
      const aEquivPos = vecAdd(offset, b);

      const matching = setA.find((a) => vecEq(a, aEquivPos));

      if (matching) matches++;
    }

    return matches;
  };

  // False or offset
  const attemptIntersect = (setA: Vec3[], setB: Vec3[]): false | Vec3 => {
    for (const a of setA) {
      for (const b of setB) {
        // calculate offset, may need to permute b, a here
        const offset = vecDiff(a, b);

        let matchCount = matchesWithOffset(setA, setB, offset);

        if (matchCount >= 12) return offset;
      }
    }

    return false;
  };

  let addedSet = new Set<string>();
  const knownRealBeaconPositions: Vec3[] = [];

  const addBeacon = (beacon: Vec3) => {
    const serialized = `${beacon.x},${beacon.y},${beacon.x}`;
    const exists = addedSet.has(serialized);

    if (exists) return;

    addedSet.add(serialized);
    knownRealBeaconPositions.push(beacon);
  };

  for (const beacon of scanners[0]) {
    addBeacon(beacon);
  }

  const scannerPositions: Vec3[] = [{ x: 0, y: 0, z: 0 }];

  const foundSet = new Set<number>();

  while (foundSet.size < scanners.length - 1) {
    for (let i = 1; i < scanners.length; i++) {
      if (foundSet.has(i)) continue;
      console.log("Attempting to resolve position for scanner", i);

      for (const rotation of ROTATIONS) {
        const foundOffset = attemptIntersect(
          knownRealBeaconPositions,
          scanners[i].map((a) => vecRotate(rotation, a))
        );

        if (foundOffset) {
          console.log(`Offset found!`);

          for (const beacon of scanners[i]) {
            const realPos = vecAdd(vecRotate(rotation, beacon), foundOffset);

            addBeacon(realPos);
          }

          scannerPositions.push(foundOffset);

          foundSet.add(i);

          console.log(knownRealBeaconPositions.length + " beacons known");

          break;
        }
      }
    }
  }

  console.log("~~~ Results ~~~~");

  console.log(knownRealBeaconPositions.length);

  console.log("~~~ Part Two ~~~");

  console.log(scannerPositions);

  const manhattanDistance = (a: Vec3, b: Vec3) => {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
  };

  let largestManhattan = -Infinity;

  for (const scannerA of scannerPositions) {
    for (const scannerB of scannerPositions) {
      largestManhattan = Math.max(
        largestManhattan,
        manhattanDistance(scannerA, scannerB)
      );
    }
  }

  console.log(largestManhattan);
};

console.log(main());
