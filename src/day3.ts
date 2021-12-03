import { readFileSync } from "fs";
import { resolve } from "path";

const main = () => {
  const input = readFileSync(
    resolve(__dirname, "../src/day3.txt"),
    "utf8"
  ).trim();

  const parsed = input.split("\n").map((line) => {
    const bits = line.split("");

    return bits.map((bit) => bit === "1");
  });

  const lineLen = parsed[0].length;

  const bitsToDecimal = (bits: boolean[]): number =>
    parseInt(bits.map((bit) => (bit ? "1" : "0")).join(""), 2);

  const mostCommon = (lines: boolean[][], pos: number): boolean | "eq" => {
    const total1 = lines.filter((line) => line[pos]).length;
    const total0 = lines.length - total1;

    if (total1 > total0) {
      return true;
    } else if (total1 < total0) {
      return false;
    } else {
      return "eq";
    }
  };

  const partOne = () => {
    const gammaRate = [];
    const epsilonRate = [];

    for (let i = 0; i < lineLen; i++) {
      const currMostCommon = mostCommon(parsed, i);

      if (currMostCommon === "eq")
        throw new Error("Pos with equal bit counts!");

      gammaRate.push(currMostCommon);
      epsilonRate.push(!currMostCommon);
    }

    return bitsToDecimal(gammaRate) * bitsToDecimal(epsilonRate);
  };

  const partTwo = () => {
    const getRating = (type: "oxygen" | "co2") => {
      let allBits = parsed;

      for (let i = 0; i < lineLen; i++) {
        let currMostCommon = mostCommon(allBits, i);

        const bitToKeep = (() => {
          if (currMostCommon === "eq") {
            return type === "oxygen";
          }

          if (type === "co2") {
            return !currMostCommon;
          }

          return currMostCommon;
        })();

        allBits = allBits.filter((pBits) => {
          return pBits[i] === bitToKeep;
        });

        if (allBits.length === 1) return allBits[0];
      }
    };

    const oxRating = bitsToDecimal(getRating("oxygen")!);
    const coRating = bitsToDecimal(getRating("co2")!);

    return oxRating * coRating;
  };

  return {
    partOne: partOne(),
    partTwo: partTwo(),
  };
};

console.log(main());
