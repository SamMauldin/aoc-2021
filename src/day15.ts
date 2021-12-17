import { readFileSync } from "fs";
import { resolve } from "path";

import Heap from "heap-js";

const main = () => {
  const input = readFileSync(
    resolve(__dirname, "../src/day15.txt"),
    "utf8"
  ).trim();

  const parsed = input.split("\n").map((line) => {
    return line.split("").map((n) => Number(n));
  });

  const distances = new Map<string, number>();
  const unvisited = new Set<string>();

  const customPriorityComparator = (a: any, b: any) => a.priority - b.priority;
  const minHeap = new Heap<{ coord: string; priority: number }>(
    customPriorityComparator
  );

  for (let x = 0; x < parsed.length * 5; x++) {
    for (let y = 0; y < parsed[0].length * 5; y++) {
      unvisited.add(`${x},${y}`);
      distances.set(`${x},${y}`, Infinity);
      minHeap.push({ coord: `${x},${y}`, priority: Infinity });
    }
  }

  const riskLevelAt = (x: number, y: number) => {
    const realX = x % parsed.length;
    const realY = y % parsed[0].length;

    const origRiskLevel = parsed[realX][realY];

    const xDist = Math.floor(x / parsed.length);
    const yDist = Math.floor(y / parsed[0].length);

    let riskLevel = origRiskLevel;

    for (let i = 0; i < xDist + yDist; i++) {
      riskLevel++;

      if (riskLevel === 10) {
        riskLevel = 1;
      }
    }

    return riskLevel;
  };

  distances.set(`0,0`, 0);
  minHeap.remove(
    { coord: "0,0", priority: Infinity },
    (a, b) => a.coord === b.coord
  );
  minHeap.add({ coord: "0,0", priority: 0 });

  while (minHeap.peek()) {
    console.log(minHeap.size());
    const { coord } = minHeap.pop()!;

    unvisited.delete(coord!);

    const [x, y] = coord!.split(",").map((n) => Number(n));

    const neighbors = [
      { x: x + 1, y },
      { x: x - 1, y },
      { x, y: y + 1 },
      { x, y: y - 1 },
    ].filter(({ x, y }) => {
      return (
        x >= 0 && y >= 0 && x < parsed.length * 5 && y < parsed[0].length * 5
      );
    });

    for (const neighbor of neighbors) {
      if (!unvisited.has(`${neighbor.x},${neighbor.y}`)) continue;

      const alt =
        distances.get(`${x},${y}`)! + riskLevelAt(neighbor.x, neighbor.y);

      const oldDistance = distances.get(`${neighbor.x},${neighbor.y}`)!;

      if (alt < oldDistance) {
        distances.set(`${neighbor.x},${neighbor.y}`, alt);
        minHeap.remove(
          { coord: `${neighbor.x},${neighbor.y}`, priority: oldDistance },
          (a, b) => a.coord === b.coord
        );
        minHeap.add({ coord: `${neighbor.x},${neighbor.y}`, priority: alt });
      }
    }
  }

  return distances.get(`${parsed.length * 5 - 1},${parsed[0].length * 5 - 1}`);
};

console.log(main());
