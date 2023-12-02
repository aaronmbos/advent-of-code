const { loadInput } = require("../../inputLoader");

async function partOne() {
  const file = await loadInput("2023", "one");
  const lines = file.split("\n");
  totalSum = 0;

  for (let idx = 0; idx < lines.length; idx++) {
    let firstNum;
    let lastNum;
    const line = lines[idx];

    // Get the first digit starting at beginning
    for (let firstIdx = 0; firstIdx < line.length; firstIdx++) {
      const val = parseInt(line[firstIdx]);
      if (val) {
        firstNum = val.toString();
        break;
      }
    }

    // Get the last digit starting at end
    for (let lastIdx = line.length - 1; lastIdx >= 0; lastIdx--) {
      const val = parseInt(line[lastIdx]);
      if (val) {
        lastNum = val.toString();
        break;
      }
    }

    const temp = firstNum + lastNum;
    totalSum += parseInt(temp);
  }

  console.log(totalSum);
}

async function partTwo() {
  const file = await loadInput("2023", "one");
  const lines = file.split("\n");
  const numMap = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
  };
  totalSum = 0;

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];

    // Get the first digit starting at beginning
    let firstNum = "";
    let spellFirstNum = "";
    for (let firstIdx = 0; firstIdx < line.length; firstIdx++) {
      const val = parseInt(line[firstIdx]);
      if (val) {
        firstNum = val.toString();
        break;
      } else {
        spellFirstNum += line[firstIdx];
        for (const num in numMap) {
          if (spellFirstNum.includes(num)) {
            firstNum = numMap[num];
            break;
          }
        }
        if (firstNum !== "") {
          break;
        }
      }
    }

    // Get the last digit starting at end
    let lastNum = "";
    let spellLastNum = "";
    for (let lastIdx = line.length - 1; lastIdx >= 0; lastIdx--) {
      const val = parseInt(line[lastIdx]);
      if (val) {
        lastNum = val.toString();
        break;
      } else {
        spellLastNum += line[lastIdx];
        for (const num in numMap) {
          if (spellLastNum.split("").toReversed().join("").includes(num)) {
            lastNum = numMap[num];
            break;
          }
        }
        if (lastNum !== "") {
          break;
        }
      }
    }

    const temp = firstNum + lastNum;
    totalSum += parseInt(temp);
  }

  console.log(totalSum);
}

Promise.resolve(partTwo());
