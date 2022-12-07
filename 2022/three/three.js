const fs = require("fs");
const rl = require("readline");
const path = require("path");

const getFile = () => {
  const filePath = path.join(__dirname, "input.txt");

  return rl.createInterface({
    input: fs.createReadStream(filePath),
    output: process.stdout,
    terminal: false,
  });
};

const isUppercase = (char) => char.charCodeAt(0) < 97;

// "a" = 97, "A" = 65
const calculateValue = (char) =>
  isUppercase(char) ? char.charCodeAt(0) - 38 : char.charCodeAt(0) - 96;

function partTwo() {
  const file = getFile();

  let totalValue = 0;
  let group = [];
  file.on("line", (line) => {
    if (group.length < 3) {
      group.push(line.trim());
    }

    if (group.length === 3) {
      let isMatch = false;
      for (const char of group[0]) {
        for (const char2 of group[1]) {
          for (const char3 of group[2]) {
            if (char === char2 && char === char3) {
              totalValue += calculateValue(char);
              isMatch = true;
              break;
            }
          }
          if (isMatch) {
            break;
          }
        }
        if (isMatch) {
          break;
        }
      }
      console.log(totalValue);
      group = [];
    }
  });
}

function partOne() {
  const file = getFile();

  let totalValue = 0;

  file.on("line", (line) => {
    const midpoint = line.trim().length / 2;
    const rucksack1 = line.substring(0, midpoint);
    const rucksack2 = line.substring(midpoint);

    // I'm sorry for the sins that I'm about to commit
    let isMatch = false;
    for (const char of rucksack1) {
      for (const char2 of rucksack2) {
        if (char === char2) {
          totalValue += calculateValue(char);
          isMatch = true;
          break;
        }
      }

      if (isMatch) {
        break;
      }
    }
    console.log(totalValue);
  });
}

partTwo();
