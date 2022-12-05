const fs = require("fs");
const rl = require("readline");
const path = require("path");

function run() {
  const filePath = path.join(__dirname, "input.txt");

  const file = rl.createInterface({
    input: fs.createReadStream(filePath),
    output: process.stdout,
    terminal: false,
  });

  let totalCalories = 0;
  let results = [];

  const sorter = (a, b) => a - b;

  file.on("line", (line) => {
    if (line === "") {
      // If we have less than three, just push it and sort
      if (results.length < 3) {
        results.push(Number(totalCalories));
        results.sort(sorter);
      } else if (totalCalories > results[0]) {
        // If this elf has more than the current 3rd highest
        // replace the 3rd and sort
        results[0] = Number(totalCalories);
        results.sort(sorter);
        // The final log will be the answer
        console.log(results.reduce((acc, a) => acc + a));
      }
      totalCalories = 0;
    } else {
      totalCalories += Number(line.trim());
    }
  });
}

run();
