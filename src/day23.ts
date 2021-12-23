import { readFileSync } from "fs";
import { resolve } from "path";

const main = () => {
  console.log("~~~ Welcome to Day 23 ~~~");

  const input = readFileSync(
    resolve(__dirname, "../src/day23.txt"),
    "utf8"
  ).trim();

  const lines = input.split("\n").map((line) => {
    return line.split("");
  });

  const structure = lines.map((line) => {
    return line.map((char) => {
      if (["A", "B", "C", "D"].includes(char)) return ".";
      return char;
    });
  });

  type Vec2 = { x: number; y: number };
  type AmphipodKind = "A" | "B" | "C" | "D";
  type Amphipod = {
    id: number;
    kind: AmphipodKind;
    loc: Vec2;
  };

  type Operation = {
    podId: number;
    moveFrom: Vec2;
    moveTo: Vec2;
  };

  const COST_MATRIX = {
    A: 1,
    B: 10,
    C: 100,
    D: 1000,
  };

  const vecEq = (a: Vec2, b: Vec2) => {
    return a.x === b.x && a.y === b.y;
  };

  const operationCost = (op: Operation, pods: Amphipod[]) => {
    const matchingPod = pods.find((pod) => pod.id === op.podId)!;

    return (
      stepsToDest(op.moveTo, op.moveFrom).length * COST_MATRIX[matchingPod.kind]
    );
  };

  const FORBIDDEN_SPACES: Vec2[] = [
    { x: 1, y: 3 },
    { x: 1, y: 5 },
    { x: 1, y: 7 },
    { x: 1, y: 9 },
  ];

  const SPACES: Vec2[] = [];

  for (let x = 0; x < structure.length; x++) {
    for (let y = 0; y < structure[0].length; y++) {
      if (structure[x][y] !== ".") continue;
      if (FORBIDDEN_SPACES.some((fSpace) => vecEq({ x, y }, fSpace))) continue;

      SPACES.push({ x, y });
    }
  }

  const emptySpaces = (pods: Amphipod[]) => {
    return SPACES.filter((space) => !pods.some((pod) => vecEq(pod.loc, space)));
  };

  const stepsToDest = (to: Vec2, from: Vec2) => {
    let steps: Vec2[] = [];

    let cX = from.x;
    let cY = from.y;

    while (cY !== to.y || cX !== to.x) {
      const nextPoint = (() => {
        if (cY === to.y) {
          return {
            x: cX < to.x ? cX + 1 : cX - 1,
            y: cY,
          };
        }

        if (cX === 1) {
          return {
            x: cX,
            y: cY < to.y ? cY + 1 : cY - 1,
          };
        }

        return {
          x: cX - 1,
          y: cY,
        };
      })();

      cX = nextPoint.x;
      cY = nextPoint.y;

      steps.push({ x: cX, y: cY });
    }

    return steps;
  };

  const reachableFrom = (to: Vec2, from: Vec2, pods: Amphipod[]) => {
    const pointFree = ({ x, y }: Vec2) => {
      if (x === from.x && y === from.y) return true;

      const matchingPod = pods.some(
        (pod) => pod.loc.x === x && pod.loc.y === y
      );
      if (matchingPod) return false;

      return true;
    };

    const steps = stepsToDest(to, from);

    return steps.every(pointFree);
  };

  const DESTINATION_ROOMS = {
    A: 3,
    B: 5,
    C: 7,
    D: 9,
  };

  const possibleOperations = (pods: Amphipod[]): Operation[] => {
    const moves: Operation[] = [];

    const spacePossibilities = emptySpaces(pods);

    for (const pod of pods) {
      const currentlyInHallway = pod.loc.x === 1;
      const destinationRoomY = DESTINATION_ROOMS[pod.kind];
      const currentlyInDestination = pod.loc.y === destinationRoomY;

      const othersInDestination = pods.some(
        (oPod) => oPod.loc.y === destinationRoomY && oPod.kind !== pod.kind
      );

      const otherMatchingPod = pods.find(
        (oPod) => oPod.id !== pod.id && oPod.kind === pod.kind
      )!;
      const otherPodInDestination = otherMatchingPod.loc.y === destinationRoomY;

      if (currentlyInDestination && otherPodInDestination) continue;

      let movesForPod: Operation[] = [];
      let movesToDestination: Operation[] = [];

      for (const space of spacePossibilities) {
        // Can't continue moving in a hallway
        if (currentlyInHallway && space.x === 1) continue;

        const isToRoom = space.x !== 1;
        const isToHallway = !isToRoom;

        // Makes no sense to leave if we're already in the destination, unless if we can go deeper
        if (currentlyInDestination) {
          if (isToHallway && !othersInDestination) continue;
          if (isToRoom && space.x < pod.loc.x) continue;
        }

        if (isToRoom) {
          if (destinationRoomY !== space.y) continue;
          if (othersInDestination) continue;
        }

        if (!reachableFrom(space, pod.loc, pods)) continue;

        if (isToRoom)
          movesToDestination.push({
            podId: pod.id,
            moveFrom: pod.loc,
            moveTo: space,
          });

        movesForPod.push({
          podId: pod.id,
          moveFrom: pod.loc,
          moveTo: space,
        });
      }

      if (movesToDestination.length > 0) {
        moves.push(...movesToDestination);
      } else {
        moves.push(...movesForPod);
      }
    }

    return moves;
  };

  const amphipods: Amphipod[] = [];

  let idAlloc = 0;

  for (const [x, line] of lines.entries()) {
    for (const [y, char] of line.entries()) {
      if (["A", "B", "C", "D"].includes(char)) {
        idAlloc++;
        amphipods.push({
          id: idAlloc,
          // @ts-ignore
          kind: char,
          loc: { x, y },
        });
      }
    }
  }

  const visualize = (pods: Amphipod[]) => {
    for (const [x, line] of structure.entries()) {
      const cLine = line.join("").split("");

      for (const pod of pods) {
        if (pod.loc.x === x) {
          cLine[pod.loc.y] = pod.kind;
        }
      }

      console.log(cLine.join(""));
    }
  };

  console.log("~~~ Parsed Input ~~~");

  console.log(visualize(amphipods));

  console.log("~~~ Computing ~~~");

  const isFinal = (pods: Amphipod[]): boolean => {
    for (const pod of pods) {
      if (pod.loc.x === 1) return false;
      if (pod.loc.y !== DESTINATION_ROOMS[pod.kind]) return false;
    }

    return true;
  };

  const TRACK_OPS = true;

  const applyOp = (
    state: State,
    operation: Operation
  ): { finished: boolean; state: State } => {
    const newPods = state.pods.map((pod) => {
      if (pod.id !== operation.podId) return pod;

      return {
        id: pod.id,
        kind: pod.kind,
        loc: operation.moveTo,
      };
    });

    const newTotalCost = state.totalCost + operationCost(operation, state.pods);

    const newState = {
      totalCost: newTotalCost,
      pods: newPods,
      ops: TRACK_OPS ? [...state.ops, operation] : state.ops,
    };

    return {
      finished: isFinal(newState.pods),
      state: newState,
    };
  };

  type State = {
    totalCost: number;
    pods: Amphipod[];
    ops: Operation[];
  };

  const visualizeFullState = (state: State) => {
    console.log("========");
    let cState: State = { totalCost: 0, pods: amphipods, ops: [] };

    visualize(cState.pods);
    console.log("Current cost", cState.totalCost);

    for (const op of state.ops) {
      console.log("");
      console.log("Executing operation", op);
      const { finished, state: newState } = applyOp(cState, op);
      cState = newState;
      visualize(cState.pods);
      console.log("Current cost", cState.totalCost);
      if (finished) console.log("Finished");
    }
    console.log("========");
  };

  let lowestCostFound = Infinity;

  const possibilityQueue: State[] = [
    { pods: amphipods, totalCost: 0, ops: [] },
  ];

  let considered = 0;
  let dead = 0;

  const costForPods = new Map<string, number>();

  while (possibilityQueue.length > 0) {
    const state = possibilityQueue.pop()!;
    considered++;

    if (considered % 100000 === 0) {
      const minConsideringCost = possibilityQueue
        .map((state) => state.totalCost)
        .reduce((a, b) => {
          return Math.min(a, b);
        }, Infinity);

      console.log("===================");
      console.log(
        `Considered ${considered}, min considering cost ${minConsideringCost}, length ${possibilityQueue.length}`
      );

      console.log("");

      visualize(state.pods);

      console.log("\\/\\/\\/\\/\\/\\/");
    }

    const possibleOps = possibleOperations(state.pods);

    if (possibleOps.length === 0) dead++;
    if (state.totalCost >= lowestCostFound) continue;

    for (const op of possibleOps) {
      const applied = applyOp(state, op);

      if (considered % 100000 === 0) {
        visualize(applied.state.pods);
      }

      // @ts-ignore
      if (applied.finished) {
        if (lowestCostFound > applied.state.totalCost) {
          lowestCostFound = applied.state.totalCost;
          visualizeFullState(applied.state);
        }
      } else if (applied.state.totalCost < lowestCostFound) {
        const podsHash = JSON.stringify(applied.state.pods);

        const existingScoreForPods = costForPods.get(podsHash) || Infinity;

        if (
          !existingScoreForPods ||
          existingScoreForPods > applied.state.totalCost
        ) {
          possibilityQueue.push(applied.state);
          costForPods.set(podsHash, applied.state.totalCost);
        }
      }
    }

    if (considered % 100000 === 0) {
      console.log("============================");
    }
  }

  console.log("~~~ Results ~~~~");

  console.log(lowestCostFound);

  console.log("~~~ Part Two ~~~");
};

console.log(main());
