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
  const file = getFile();

  let totalOverlaps = 0;
  file.on("line", (line) => {
    const [first, second] = line.trim().split(",");

    const [fStart, fEnd] = first.split("-");
    const [sStart, sEnd] = second.split("-");

    if (Number(fEnd) >= Number(sStart) && Number(sEnd) >= Number(fStart)) {
      totalOverlaps++;
    }

    console.log(totalOverlaps);
  });
}

function partOne() {
  const file = getFile();

  let totalOverlaps = 0;
  file.on("line", (line) => {
    const [first, second] = line.trim().split(",");

    const [fStart, fEnd] = first.split("-");
    const [sStart, sEnd] = second.split("-");

    if (
      (Number(sStart) >= Number(fStart) && Number(sEnd) <= Number(fEnd)) ||
      Number(sStart <= Number(fStart) && Number(sEnd) >= Number(fEnd))
    ) {
      totalOverlaps++;
    }

    console.log(totalOverlaps);
  });
}

partTwo();
