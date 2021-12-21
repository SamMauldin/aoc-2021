import { readFileSync } from "fs";
import { resolve } from "path";

const main = () => {
  console.log("~~~ Welcome to Day 21 ~~~");

  const input = readFileSync(
    resolve(__dirname, "../src/day21.txt"),
    "utf8"
  ).trim();

  const [playerA, playerB] = input.split("\n").map((line) => {
    const sl = line.split(" ");
    return Number(sl[sl.length - 1]);
  });

  console.log("~~~ Parsed Input ~~~");

  console.log(playerA, playerB);

  console.log("~~~ Computing ~~~");

  type GameState = {
    aSpace: number;
    aScore: number;
    bSpace: number;
    bScore: number;
  };

  let aWins = 0;
  let bWins = 0;

  const serializeState = (gs: GameState) =>
    `${gs.aSpace},${gs.aScore},${gs.bSpace},${gs.bScore}`;
  const unserializeState = (state: string) => {
    const [aSpace, aScore, bSpace, bScore] = state
      .split(",")
      .map((n) => Number(n));

    return { aSpace, aScore, bSpace, bScore };
  };

  let gameStates = new Map<string, number>();

  gameStates.set(
    serializeState({
      aSpace: playerA,
      bSpace: playerB,
      aScore: 0,
      bScore: 0,
    }),
    1
  );

  let turn: "a" | "b" = "a";

  const addOrIncrement = (
    game: GameState,
    map: Map<string, number>,
    byCount: number
  ) => {
    const serialized = serializeState(game);

    const existing = map.get(serialized) ?? 0;

    map.set(serialized, existing + byCount);
  };

  const DICE_POSSIBILITIES = [];

  for (let d1 = 1; d1 <= 3; d1++) {
    for (let d2 = 1; d2 <= 3; d2++) {
      for (let d3 = 1; d3 <= 3; d3++) {
        DICE_POSSIBILITIES.push(d1 + d2 + d3);
      }
    }
  }

  console.log(DICE_POSSIBILITIES);

  const calcSpace = (space: number, roll: number) => {
    for (let i = 0; i < roll; i++) {
      space += 1;
      if (space === 11) space = 1;
    }
    return space;
  };

  while (gameStates.size > 0) {
    let newGameStates = new Map<string, number>();
    for (const [game, count] of gameStates.entries()) {
      let { aSpace, aScore, bSpace, bScore } = unserializeState(game);

      if (aScore >= 21) {
        aWins += count;
        continue;
      } else if (bScore >= 21) {
        bWins += count;
        continue;
      }

      if (turn === "a") {
        for (const rollPossibility of DICE_POSSIBILITIES) {
          const aNewSpace = calcSpace(aSpace, rollPossibility);
          const aNewScore = aScore + aNewSpace;

          addOrIncrement(
            {
              aSpace: aNewSpace,
              aScore: aNewScore,
              bSpace,
              bScore,
            },
            newGameStates,
            count
          );
        }
      } else {
        for (const rollPossibility of DICE_POSSIBILITIES) {
          const bNewSpace = calcSpace(bSpace, rollPossibility);
          const bNewScore = bScore + bNewSpace;

          addOrIncrement(
            {
              aSpace,
              aScore,
              bSpace: bNewSpace,
              bScore: bNewScore,
            },
            newGameStates,
            count
          );
        }
      }
    }
    gameStates = newGameStates;

    if (turn === "a") {
      turn = "b";
    } else {
      turn = "a";
    }
  }

  console.log("~~~ Results ~~~~");

  console.log(Math.max(aWins, bWins));

  console.log("~~~ Part Two ~~~");
};

console.log(main());
