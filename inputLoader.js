const fs = require("fs/promises");
const path = require("path");

const loadInput = async (year, day) => {
  const filePath = path.join(__dirname, year, day, "input.txt");

  return (await fs.readFile(filePath, { encoding: "utf8" }))
    .replace(/\r/g, "")
    .trim();
};

exports.loadInput = loadInput;
