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
  let result = 0;
  file.on("line", (line) => {
    if (line === "") {
      if (totalCalories > result) {
        result = totalCalories;
        console.log(`Result: ${result}`);
      }
      totalCalories = 0;
    } else {
      totalCalories += Number(line.trim());
    }
  });
}

run();
