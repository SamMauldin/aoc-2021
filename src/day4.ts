import { readFileSync } from "fs";
import { resolve } from "path";

const main = () => {
  const input = readFileSync(
    resolve(__dirname, "../src/day4.txt"),
    "utf8"
  ).trim();

  const lines = input.split("\n").map((line) => line.trim());

  const numbers = lines[0].split(",").map((num) => Number(num));

  const boards: number[][][] = [];

  for (let i = 2; i < lines.length; i += 6) {
    const board = [
      lines[i].split(/\s+/).map((num) => Number(num)),
      lines[i + 1].split(/\s+/).map((num) => Number(num)),
      lines[i + 2].split(/\s+/).map((num) => Number(num)),
      lines[i + 3].split(/\s+/).map((num) => Number(num)),
      lines[i + 4].split(/\s+/).map((num) => Number(num)),
    ];

    boards.push(board);
  }

  const winning = (board: number[][], drawn: number[]) => {
    const check = (...nums: number[]) =>
      nums.every((num) => drawn.includes(num));

    if (check(board[0][0], board[1][1], board[2][2], board[3][3], board[4][4]))
      return true;

    if (check(board[4][4], board[3][3], board[2][2], board[1][1], board[0][0]))
      return true;

    for (let i = 0; i < 5; i++) {
      if (
        check(board[i][0], board[i][1], board[i][2], board[i][3], board[i][4])
      )
        return true;
      if (
        check(board[0][i], board[1][i], board[2][i], board[3][i], board[4][i])
      )
        return true;
    }

    return false;
  };

  const partOne = () => {
    const { boardIdx, drawnIdx, drawn } = (() => {
      const drawn = [];
      for (let i = 0; i < numbers.length; i++) {
        drawn.push(numbers[i]);

        for (let b = 0; b < boards.length; b++) {
          if (winning(boards[b], drawn)) {
            return { boardIdx: b, drawnIdx: i, drawn };
          }
        }
      }
    })()!;

    const winningBoardContents = boards[boardIdx].flat();

    const unmarked = winningBoardContents
      .filter((num) => !drawn.includes(num))
      .reduce((a, b) => a + b, 0);

    return unmarked * numbers[drawnIdx];
  };

  const partTwo = () => {
    const { boardIdx, drawnIdx, drawn } = (() => {
      const drawn = [];

      const haventWon = new Set(boards.map((_, idx) => idx));

      for (let i = 0; i < numbers.length; i++) {
        drawn.push(numbers[i]);

        for (let b = 0; b < boards.length; b++) {
          if (winning(boards[b], drawn)) {
            if (haventWon.size === 1 && haventWon.has(b)) {
              return { boardIdx: b, drawnIdx: i, drawn };
            } else {
              haventWon.delete(b);
            }
          }
        }
      }
    })()!;

    const winningBoardContents = boards[boardIdx].flat();

    const unmarked = winningBoardContents
      .filter((num) => !drawn.includes(num))
      .reduce((a, b) => a + b, 0);

    return unmarked * numbers[drawnIdx];
  };

  return {
    partOne: partOne(),
    partTwo: partTwo(),
  };
};

console.log(main());
