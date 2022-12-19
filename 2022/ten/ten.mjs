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

function partTwo(lines) {
  const signals = lines.map((line) => parseSignal(line));

  let cycleCount = 0;
  let crtIdx = 0;
  let spriteCenterIdx = 1;
  let crt = [[]];
  let crtRow = 0;

  for (const signal of signals) {
    for (let idx = 0; idx < signal.cycles; idx++) {
      cycleCount++;
      if (isOverlappingSprite(crtIdx, spriteCenterIdx)) {
        crt[crtRow][crtIdx] = "#";
      } else {
        crt[crtRow][crtIdx] = ".";
      }
      crtIdx++;
      if (crtIdx === 40) {
        crtIdx = 0;
        crtRow++;
        crt.push([]);
      }
    }
    spriteCenterIdx += signal.value;
  }

  printCrt(crt);
}

function printCrt(crt) {
  let display = "";
  for (const row of crt) {
    display += row.join("");
    display += "\n";
  }
  console.log(display);
}

function isOverlappingSprite(crtPosition, spriteCenterIndex) {
  // The sprite is 3 pixels wide, but only tracking the center of it
  return (
    crtPosition >= spriteCenterIndex - 1 && crtPosition <= spriteCenterIndex + 1
  );
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
      }
    }
    register += signal.value;
  }

  console.log("strength", strengthSum);
}

partOne(await getFileLines());
partTwo(await getFileLines());
