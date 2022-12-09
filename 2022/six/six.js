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

function partTwo() {}

function partOne() {
  const file = getFile();

  file.on("line", (line) => {
    const chars = line.split("");
    let temp = [];
    for (let i = 0; i < chars.length; i++) {
      temp.push(chars[i]);

      let foundMarker = false;
      let count = 0;
      // part 1: j <= 3
      for (let j = 1; j <= 13; j++) {
        if (!temp.includes(chars[i + j])) {
          temp.push(chars[i + j]);

          // part 1: .length === 4
          if (temp.length === 14) {
            foundMarker = true;
            count = i + j;
            break;
          }
        } else {
          break;
        }
      }

      if (foundMarker) {
        console.log(count + 1);
        break;
      } else {
        temp = [];
      }
    }
  });
}

partOne();
