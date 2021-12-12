import { readFileSync } from "fs";
import { resolve } from "path";

const main = () => {
  const input = readFileSync(
    resolve(__dirname, "../src/day12.txt"),
    "utf8"
  ).trim();

  const connections = input.split("\n").map((line) => {
    return line.split("-");
  });

  const nodes: { [nodeId: string]: string[] } = {};

  for (const [nodeNameA, nodeNameB] of connections) {
    const nodeA = nodes[nodeNameA] || [];
    nodeA.push(nodeNameB);
    nodes[nodeNameA] = nodeA;

    const nodeB = nodes[nodeNameB] || [];
    nodeB.push(nodeNameA);
    nodes[nodeNameB] = nodeB;
  }

  console.log(nodes);

  const findPaths = (
    currentPath: string[],
    currentNode: string
  ): string[][] => {
    if (currentNode === "end") return [currentPath];
    const smallCaveVisitedTwiceAlready = currentPath
      .filter((pN) => pN.toLowerCase() === pN)
      .some((pN) => currentPath.filter((pn2) => pn2 === pN).length === 2);

    const availableNodes = nodes[currentNode].filter(
      (nodeName) =>
        nodeName !== "start" &&
        (nodeName.toUpperCase() === nodeName ||
          currentPath.filter((pN) => pN === nodeName).length <
            (smallCaveVisitedTwiceAlready ? 1 : 2))
    );

    return availableNodes.flatMap((node) =>
      findPaths([...currentPath, node], node)
    );
  };

  const partOne = () => {
    const paths = findPaths(["start"], "start");

    console.log(paths.map((path) => path.join(",")));

    const pathSet = new Set(paths.map((path) => path.join(",")));

    console.log(pathSet.size);
  };

  const partTwo = () => {};

  return {
    partOne: partOne(),
    partTwo: partTwo(),
  };
};

console.log(main());
