const { loadInput } = require("../../inputLoader");

async function partOne() {
  const lines = (await loadInput("2023", "two")).split("\n");
  let gameSum = 0;
  lines.forEach((line) => {
    const [gamePart, cubePart] = line.split(":");
    const gameId = parseInt(gamePart.split(" ")[1]);
    let isValidGame = true;
    const subsets = cubePart.split(";").map((subset) => {
      return subset
        .trim()
        .split(",")
        .map((color) => color.trim());
    });

    for (const subset of subsets) {
      const totals = {
        red: { sum: 0, max: 12 },
        green: { sum: 0, max: 13 },
        blue: { sum: 0, max: 14 },
      };
      for (const group of subset) {
        const [count, color] = group.split(" ");
        switch (color) {
          case "red":
            totals.red.sum += parseInt(count);
            break;
          case "green":
            totals.green.sum += parseInt(count);
            break;
          case "blue":
            totals.blue.sum += parseInt(count);
            break;
          default:
            console.log("Unknown color");
            break;
        }
      }
      if (
        totals.red.sum > totals.red.max ||
        totals.green.sum > totals.green.max ||
        totals.blue.sum > totals.blue.max
      ) {
        isValidGame = false;
        break;
      }
    }
    if (isValidGame) {
      gameSum += gameId;
    }
  });
  console.log(gameSum);
}

async function partTwo() {
  const lines = (await loadInput("2023", "two")).split("\n");
  let gameSum = 0;
  lines.forEach((line) => {
    const [gamePart, cubePart] = line.split(":");
    const subsets = cubePart.split(";").map((subset) => {
      return subset
        .trim()
        .split(",")
        .map((color) => color.trim());
    });

    const totals = {
      red: { sum: 0, max: 12, min: 0 },
      green: { sum: 0, max: 13, min: 0 },
      blue: { sum: 0, max: 14, min: 0 },
    };
    for (const subset of subsets) {
      for (const group of subset) {
        const [count, color] = group.split(" ");
        switch (color) {
          case "red":
            val = parseInt(count);
            if (val > totals.red.min) {
              totals.red.min = val;
            }
            break;
          case "green":
            val = parseInt(count);
            if (val > totals.green.min) {
              totals.green.min = val;
            }
            break;
          case "blue":
            val = parseInt(count);
            if (val > totals.blue.min) {
              totals.blue.min = val;
            }
            break;
          default:
            console.log("Unknown color");
            break;
        }
      }
    }
    gameSum += totals.red.min * totals.green.min * totals.blue.min;
  });
  console.log(gameSum);
}

Promise.resolve(partTwo());
