import { readFileSync } from "fs";
import { resolve } from "path";

const main = () => {
  const input = readFileSync(
    resolve(__dirname, "../src/day10.txt"),
    "utf8"
  ).trim();

  const parsed = input.split("\n").map((line) => {
    return line.split("");
  });

  const COMPLEMENTS = {
    "(": ")",
    "[": "]",
    "{": "}",
    "<": ">",
  };

  const SCORES = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137,
  };

  const COMPLETE_SCORES = {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4,
  };

  const partOne = () => {
    let totalScore = 0;

    const scores: number[] = [];

    for (const line of parsed) {
      const stack = [];

      let score = 0;

      for (const char of line) {
        if (["(", "[", "{", "<"].includes(char)) {
          stack.push(char);
          // @ts-ignore
        } else if (COMPLEMENTS[stack[stack.length - 1]] === char) {
          stack.pop();
        } else {
          // @ts-ignore
          score = SCORES[char];
          break;
          // error!
        }
      }

      if (stack.length !== 0 && !score) {
        console.log("incomplete");
        // @ts-ignore
        const completeStack = stack.map((char) => COMPLEMENTS[char]).reverse();

        console.log(completeStack);

        score = 0;
        for (const char of completeStack) {
          score *= 5;

          // @ts-ignore
          score += COMPLETE_SCORES[char];
        }
        scores.push(score);
      }
      totalScore += score;
    }

    console.log(scores);

    scores.sort((a, b) => b - a);

    console.log(scores);

    return scores[Math.floor(scores.length / 2)];

    return totalScore;
  };

  const partTwo = () => {};

  return {
    partOne: partOne(),
    partTwo: partTwo(),
  };
};

console.log(main());
