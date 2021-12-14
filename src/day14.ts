import { readFileSync } from "fs";
import { resolve } from "path";

const main = () => {
  const input = readFileSync(
    resolve(__dirname, "../src/day14.txt"),
    "utf8"
  ).trim();

  const [template, ruleLines] = input.split("\n\n");

  const rules = ruleLines.split("\n").map((line) => {
    const [i, o] = line.split(" -> ");

    return { i, o };
  });

  const ruleMap = new Map<string, string>();

  for (const rule of rules) {
    ruleMap.set(rule.i, rule.o);
  }

  let instances = new Map<string, number>();

  let lastElem: string | null = null;
  for (const elem of template.split("")) {
    if (!lastElem) {
      lastElem = elem;
      continue;
    }

    const lookingFor = lastElem + elem;
    const existingCount = instances.get(lookingFor) || 0;
    instances.set(lookingFor, existingCount + 1);
    lastElem = elem;
  }

  console.log(instances);

  for (let step = 1; step <= 40; step++) {
    console.log(step);

    const newInstances = new Map<string, number>();

    for (const [pair, count] of instances.entries()) {
      const outForPair = ruleMap.get(pair);

      if (!outForPair) {
        const existingCount = newInstances.get(pair) || 0;
        newInstances.set(pair, existingCount + count);
        continue;
      }

      const startNewPair = pair[0] + outForPair;
      const endNewPair = outForPair + pair[1];

      const existingCountStart = newInstances.get(startNewPair) || 0;
      newInstances.set(startNewPair, existingCountStart + count);
      const existingCountEnd = newInstances.get(endNewPair) || 0;
      newInstances.set(endNewPair, existingCountEnd + count);
    }

    instances = newInstances;
  }

  console.log(instances);

  const elements: { [elem: string]: number } = {};

  for (const [pair, count] of instances.entries()) {
    const elementA = pair[0];

    const countA = elements[elementA] || 0;
    elements[elementA] = countA + count;
  }

  elements[template[template.length - 1]] += 1;

  console.log(elements);

  const counts = Object.values(elements).sort((a, b) => b - a);

  console.log(counts[0] - counts[counts.length - 1]);
};

console.log(main());
