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

function partTwo() {
  file = getFile();
  let crates = [[]];
  let counter = 0;
  file.on("line", (line) => {
    let start = 1;
    if (counter <= 7) {
      for (let i = 0; i < 9; i++) {
        const char = line[start];

        if (!crates[i]) {
          crates[i] = [];
        }
        if (char !== " ") {
          crates[i].unshift(char);
        }
        start += 4;
      }
    } else if (counter >= 9) {
      const words = line.split(" ");
      const count = Number(words[1]);
      const from = Number(words[3]);
      const to = Number(words[5]);

      const len = crates[from - 1]?.length;
      if (len) {
        const spliced = crates[from - 1]?.splice(len - count);
        for (let i = 0; i < spliced.length; i++) {
          crates[to - 1].push(spliced[i]);
        }
      }
    }
    counter++;
    console.log(crates);
  });
}

function partOne() {
  file = getFile();
  let crates = [[]];
  let counter = 0;
  file.on("line", (line) => {
    let start = 1;
    if (counter <= 7) {
      for (let i = 0; i < 9; i++) {
        const char = line[start];

        if (!crates[i]) {
          crates[i] = [];
        }
        if (char !== " ") {
          crates[i].unshift(char);
        }
        start += 4;
      }
    } else if (counter >= 9) {
      const words = line.split(" ");
      const count = Number(words[1]);
      const from = Number(words[3]);
      const to = Number(words[5]);

      for (let i = 0; i < count; i++) {
        crates[to - 1].push(crates[from - 1].pop());
      }
    }
    counter++;
    console.log(crates);
  });
}

partTwo();
