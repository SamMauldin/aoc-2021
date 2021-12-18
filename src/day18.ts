import { assert } from "console";
import { readFileSync } from "fs";
import { resolve } from "path";

const main = () => {
  console.log("~~~ Welcome to Day 18 ~~~");

  const input = readFileSync(
    resolve(__dirname, "../src/day18.txt"),
    "utf8"
  ).trim();

  type SnailfishNumber = [number | SnailfishNumber, number | SnailfishNumber];

  const lines: SnailfishNumber[] = input
    .split("\n")
    .map((line) => JSON.parse(line));

  type Token = "[" | "]" | number;

  const toToken = (num: SnailfishNumber | number): Token[] => {
    if (typeof num === "number") return [num];

    return ["[", ...toToken(num[0]), ...toToken(num[1]), "]"];
  };

  const tokenLines = lines.map(toToken);

  console.log("~~~ Parsed Input ~~~");

  console.log(tokenLines);

  console.log("~~~ Computing ~~~");

  const reduce = (num: Token[], phase: "explode" | "split"): boolean => {
    let depth = 0;

    for (let i = 0; i < num.length; i++) {
      const cToken = num[i];

      if (cToken === "[") {
        depth++;

        if (depth > 4 && phase === "explode") {
          // explode
          const leftNum = num[i + 1];
          const rightNum = num[i + 2];
          assert(typeof leftNum === "number");
          assert(typeof rightNum === "number");

          num.splice(i, 4, 0);

          for (let lmI = i - 1; lmI >= 0; lmI--) {
            if (typeof num[lmI] === "number") {
              // @ts-ignore
              num[lmI] += leftNum;
              break;
            }
          }

          for (let rnI = i + 1; rnI < num.length; rnI++) {
            if (typeof num[rnI] === "number") {
              // @ts-ignore
              num[rnI] += rightNum;
              break;
            }
          }

          return true;
        }
      } else if (cToken === "]") {
        depth--;
      } else if (typeof cToken === "number") {
        if (cToken >= 10 && phase === "split") {
          // split
          const res = cToken / 2;

          num.splice(i, 1, "[", Math.floor(res), Math.ceil(res), "]");

          return true;
        }
      } else {
        throw new Error("Unknown token type!");
      }
    }

    return false;
  };

  const fullReduce = (token: Token[]) => {
    while (true) {
      if (reduce(token, "explode")) continue;
      if (reduce(token, "split")) continue;
      break;
    }
  };

  let a = tokenLines[0];

  for (let i = 1; i < tokenLines.length; i++) {
    a = ["[", ...a, ...tokenLines[i], "]"];

    fullReduce(a);
  }

  const restore = (z: Token[]): SnailfishNumber =>
    JSON.parse(
      z
        .map((token, idx) => {
          if (typeof token === "number" && z[idx + 1] !== "]") {
            return String(token) + ",";
          } else if (
            token === "]" &&
            z[idx + 1] !== "]" &&
            idx + 1 < z.length
          ) {
            return token + ",";
          }

          return token;
        })
        .join("")
    );

  const magnitude = (num: SnailfishNumber | number): number => {
    if (typeof num === "number") return num;

    const [left, right] = num;

    return 3 * magnitude(left) + 2 * magnitude(right);
  };

  console.log("~~~ Results ~~~~");

  console.log(magnitude(restore(a)));

  console.log(`~~~ Part Two ~~~`);

  let largestMag = -Infinity;

  for (let x = 0; x < tokenLines.length; x++) {
    for (let y = 0; y < tokenLines.length; y++) {
      if (x === y) continue;

      const sum: Token[] = ["[", ...tokenLines[x], ...tokenLines[y], "]"];

      fullReduce(sum);

      largestMag = Math.max(largestMag, magnitude(restore(sum)));
    }
  }

  console.log(largestMag);
};

console.log(main());
