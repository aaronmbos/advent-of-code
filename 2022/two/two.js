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

const win = 6;
const draw = 3;

const opponentMap = {
  Rock: "A",
  Paper: "B",
  Scissors: "C",
  A: 1,
  B: 2,
  C: 3,
};

const selfMap = {
  Rock: "X",
  Paper: "Y",
  Scissors: "Z",
  X: 1,
  Y: 2,
  Z: 3,
};

let totalScore = 0;

function partOne() {
  const file = getFile();

  file.on("line", (line) => {
    const [opp, self] = line.trim().split(" ");

    switch (opp) {
      case opponentMap.Rock:
        switch (self) {
          case selfMap.Rock:
            totalScore += draw + selfMap[selfMap.Rock];
            break;
          case selfMap.Paper:
            totalScore += win + selfMap[selfMap.Paper];
            break;
          case selfMap.Scissors:
            totalScore += selfMap[selfMap.Scissors];
            break;
        }
        break;
      case opponentMap.Paper:
        switch (self) {
          case selfMap.Rock:
            totalScore += selfMap[selfMap.Rock];
            break;
          case selfMap.Paper:
            totalScore += draw + selfMap[selfMap.Paper];
            break;
          case selfMap.Scissors:
            totalScore += win + selfMap[selfMap.Scissors];
            break;
        }
        break;
      case opponentMap.Scissors:
        switch (self) {
          case selfMap.Rock:
            totalScore += win + selfMap[selfMap.Rock];
            break;
          case selfMap.Paper:
            totalScore += selfMap[selfMap.Paper];
            break;
          case selfMap.Scissors:
            totalScore += draw + selfMap[selfMap.Scissors];
            break;
        }
        break;
    }
    console.log(totalScore);
  });
}

partOne();
