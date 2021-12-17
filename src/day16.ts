import { readFileSync } from "fs";
import { resolve } from "path";

const main = () => {
  const input = readFileSync(
    resolve(__dirname, "../src/day16.txt"),
    "utf8"
  ).trim();

  const HEX_TABLE: { [key: string]: string } = {
    "0": "0000",
    "1": "0001",
    "2": "0010",
    "3": "0011",
    "4": "0100",
    "5": "0101",
    "6": "0110",
    "7": "0111",
    "8": "1000",
    "9": "1001",
    A: "1010",
    B: "1011",
    C: "1100",
    D: "1101",
    E: "1110",
    F: "1111",
  };

  const bits = input.split("").flatMap((hex) => {
    return HEX_TABLE[hex].split("");
  });

  console.log(bits);

  let i = 0;
  let versionSum = 0;

  const read = (count: number) => {
    let res = "";
    for (let idx = 0; idx < count; idx++) {
      res += bits[i + idx];
    }
    i += count;

    if (i > bits.length) throw new Error("Read beyond bounds");

    return parseInt(res, 2);
  };

  const readRaw = (count: number) => {
    let res = "";
    for (let idx = 0; idx < count; idx++) {
      res += bits[i + idx];
    }
    i += count;

    if (i > bits.length) throw new Error("Read beyond bounds");

    return res;
  };

  const parsePacket = (): number => {
    const version = read(3);
    versionSum += version;
    const type = read(3);
    console.log(`Processing packet v${version}, type ${type}`);

    if (type === 4) {
      // Literal packet
      let bitsRead = 0;
      let valueRaw = "";
      while (true) {
        bitsRead += 5;
        let subPart = readRaw(5);
        const parts = subPart.slice(1);

        valueRaw += parts;

        if (subPart[0] === "0") {
          break;
        }
      }

      return parseInt(valueRaw, 2);
    } else {
      // Operator packet
      const lengthType = read(1);

      let decoded: number[] = [];

      if (lengthType === 0) {
        // Length is encoded in bits
        const bitCount = read(15);
        const startBitCount = i;

        while (i < startBitCount + bitCount) {
          decoded.push(parsePacket());
        }
      } else {
        // Length is encoded in packets
        const packetsToDecode = read(11);

        for (let idx = 0; idx < packetsToDecode; idx++) {
          // sub packet parsing!
          decoded.push(parsePacket());
        }
      }

      console.log(`decoded inner`, decoded);

      if (type === 0) {
        // sum all inner
        return decoded.reduce((a, b) => a + b, 0);
      } else if (type === 1) {
        // product all inner
        return decoded.reduce((a, b) => a * b, 1);
      } else if (type === 2) {
        // minimum all inner
        return decoded.reduce((a, b) => Math.min(a, b), Infinity);
      } else if (type === 3) {
        // max all inner
        return decoded.reduce((a, b) => Math.max(a, b), 0);
      } else if (type === 5) {
        // greater than
        return decoded[0] > decoded[1] ? 1 : 0;
      } else if (type === 6) {
        //less than
        return decoded[0] < decoded[1] ? 1 : 0;
      } else if (type === 7) {
        // equal to
        return decoded[0] === decoded[1] ? 1 : 0;
      } else {
        throw new Error("unknown type");
      }
    }
  };

  while (i < bits.length) {
    console.log(`processing next`);
    const res = parsePacket();

    console.log(`decoded ${res}`);

    while (i % 4 !== 0 && i < bits.length) {
      read(1);
    }
  }

  console.log("Version Sum", versionSum);
};

console.log(main());
