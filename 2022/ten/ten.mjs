import { readFile } from "fs/promises";
import { join } from "path";

async function getFileLines() {
  const filePath = join(process.cwd(), "input.txt");

  return (await readFile(filePath, { encoding: "utf8" }))
    .replace(/\r/g, "")
    .trim()
    .split("\n");
}

function parseSignal(rawSignal) {
  switch (rawSignal) {
    case "noop":
      return { sig: "noop", value: 0, cycles: 1 };
    default:
      const [sig, val] = rawSignal.split(" ");
      return { sig, value: parseInt(val), cycles: 2 };
  }
}

function partOne(lines) {
  const signals = lines.map((line) => parseSignal(line));

  let cycleCount = 0;
  let cycleValue = 20;
  let register = 1;
  let strengthSum = 0;

  for (const signal of signals) {
    for (let idx = 0; idx < signal.cycles; idx++) {
      cycleCount++;
      if (cycleCount <= 220 && cycleCount === cycleValue) {
        strengthSum += cycleCount * register;
        cycleValue += 40;
        console.log("cycles", cycleCount);
        console.log("register", register);
        console.log("strength", strengthSum);
      }
    }
    register += signal.value;
  }
}

partOne(await getFileLines());
