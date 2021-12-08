import { readFileSync } from "fs";
import { resolve } from "path";

const main = () => {
  const input = readFileSync(
    resolve(__dirname, "../src/day8.txt"),
    "utf8"
  ).trim();

  const parsed = input.split("\n").map((line) => {
    return line
      .split(" ")
      .map((digit) => {
        return digit.split("");
      })
      .filter((digit) => digit[0] !== "|");
  });

  const SEGMENT_DATA = [
    "abcefg",
    "cf",
    "acdeg",
    "acdfg",
    "bcdf",
    "abdfg",
    "abdefg",
    "acf",
    "abcdefg",
    "abcdfg",
  ];

  const inverse = (options: string[]) => {
    return "abcdefg".split("").filter((opt) => !options.includes(opt));
  };

  const partOne = () => {
    let total = 0;

    for (const line of parsed) {
      const possibilities = {
        a: ["a", "b", "c", "d", "e", "f", "g"],
        b: ["a", "b", "c", "d", "e", "f", "g"],
        c: ["a", "b", "c", "d", "e", "f", "g"],
        d: ["a", "b", "c", "d", "e", "f", "g"],
        e: ["a", "b", "c", "d", "e", "f", "g"],
        f: ["a", "b", "c", "d", "e", "f", "g"],
        g: ["a", "b", "c", "d", "e", "f", "g"],
      };

      const mustBe = (
        section: keyof typeof possibilities,
        constraint: string[]
      ) => {
        possibilities[section] = possibilities[section].filter((possibility) =>
          constraint.includes(possibility)
        );
      };

      // 1 4 7

      const ones = line.filter((digit) => digit.length == 2)[0];
      if (ones) {
        mustBe("c", ones);
        mustBe("f", ones);
      }

      const fours = line.filter((digit) => digit.length == 4)[0];
      if (fours) {
        mustBe("b", fours);
        mustBe("c", fours);
        mustBe("d", fours);
        mustBe("f", fours);
      }

      const sevens = line.filter((digit) => digit.length == 3)[0];
      if (sevens) {
        mustBe("a", sevens);
        mustBe("c", sevens);
        mustBe("f", sevens);
      }

      // 0 6 9
      const zeroesNines = line.filter((digit) => digit.length === 6);
      zeroesNines.forEach((signals) => {
        mustBe("a", signals);
        mustBe("b", signals);
        mustBe("f", signals);
        mustBe("g", signals);
      });

      // 2 3 5
      const twoThreeFive = line.filter((digit) => digit.length === 5);
      twoThreeFive.forEach((signals) => {
        mustBe("a", signals);
        mustBe("d", signals);
        mustBe("g", signals);
      });

      for (let i = 0; i < 5; i++) {
        for (const char of "abcdefg".split("")) {
          // @ts-ignore
          const possibilitiesForChar: string[] = possibilities[char];

          if (possibilitiesForChar.length === 1) {
            for (const iChar of "abcdefg".split("")) {
              if (char === iChar) continue;
              // @ts-ignore
              mustBe(iChar, inverse(possibilitiesForChar));
            }
          }
        }
      }

      console.log(possibilities);

      const attemptDecode = (digit: string[]) => {
        console.log("decoding", digit);

        let match = -1;

        for (const [num, signals] of SEGMENT_DATA.entries()) {
          if (signals.length !== digit.length) continue;

          const signalPossibilities: string[][] = signals
            .split("")
            // @ts-ignore
            .map((char) => possibilities[char]);

          for (let i = 0; i < 5; i++) {
            for (const [
              idx,
              digitPossibilities,
            ] of signalPossibilities.entries()) {
              if (digitPossibilities.length === 1) {
                for (const [iIdx, iPos] of signalPossibilities.entries()) {
                  if (iIdx == idx) continue;

                  signalPossibilities[iIdx] = iPos.filter(
                    (char) => char !== digitPossibilities[0]
                  );
                }
              }
            }
          }

          const computePermutations = (
            arr: string[][],
            prefix: string
          ): string[] => {
            if (arr.length === 0) return [prefix];
            const permutations = arr[0];

            return permutations.flatMap((perm) =>
              computePermutations(arr.slice(1), prefix + perm)
            );
          };

          const permutations: string[] = computePermutations(
            signalPossibilities,
            ""
          ).map((str) => str.split("").sort().join(""));

          const needs = digit.sort().join("");

          console.log(
            "perms",
            permutations.includes(needs),
            num,
            permutations,
            needs
          );

          if (permutations.includes(needs)) {
            if (match !== -1) {
              throw new Error("dup!");
            }
            match = num;
          }
        }

        if (match !== -1) return match;

        throw new Error("unable to decode!");
      };

      total += Number(
        [
          line[line.length - 4],
          line[line.length - 3],
          line[line.length - 2],
          line[line.length - 1],
        ]
          .map(attemptDecode)
          .join("")
      );
    }

    return total;
  };

  const partTwo = () => {};

  return {
    partOne: partOne(),
    partTwo: partTwo(),
  };
};

console.log(main());
