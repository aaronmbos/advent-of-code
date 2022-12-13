const fs = require("fs/promises");
const path = require("path");

const getFileLines = async () => {
  const filePath = path.join(__dirname, "input.txt");

  return (await fs.readFile(filePath, { encoding: "utf8" }))
    .replace(/\r/g, "")
    .trim()
    .split("\n");
};

function isVisibleVertically(value, column, row, lines) {
  let above = [];
  let below = [];

  for (let idx = 0; idx < lines.length; idx++) {
    if (idx < row) {
      above.push(parseInt(lines[idx].split("")[column]));
    } else if (idx > row) {
      below.push(parseInt(lines[idx].split("")[column]));
    }
  }
  if (above.every((x) => x < value) || below.every((x) => x < value)) {
    return true;
  }

  return false;
}

function calculateDirectionScore(value, trees, shouldReverse = false) {
  //console.log(trees, shouldReverse);
  if (shouldReverse) {
    trees.reverse();
  }
  let score = 0;

  for (let idx = 0; idx < trees.length; idx++) {
    const parsed = parseInt(trees[idx]);
    if (idx === 0) {
      if (parsed < value) {
        score++;
        continue;
      }
    } else {
      if (parsed < value) {
        score++;
        continue;
      }
    }
    score++;
    break;
  }
  return score;
}

function calculateVerticalScores(value, column, row, lines) {
  let above = [];
  let below = [];

  for (let idx = 0; idx < lines.length; idx++) {
    if (idx < row) {
      above.push(parseInt(lines[idx].split("")[column]));
    } else if (idx > row) {
      below.push(parseInt(lines[idx].split("")[column]));
    }
  }

  const totalAboveScore = calculateDirectionScore(value, above, true);
  const totalBelowScore = calculateDirectionScore(value, below);

  return [totalAboveScore, totalBelowScore];
}

async function partTwo() {
  const lines = await getFileLines();

  // Add the edge trees initially
  let maxTreeScore = 0;
  for (let idx = 1; idx < lines.length - 1; idx++) {
    let currentPoint = { y: idx, x: 1 };
    let left = [];
    let right = [];
    for (let jdx = 1; jdx < lines[idx].length - 1; jdx++) {
      const char = parseInt(lines[idx][jdx]);
      left = lines[idx].slice(0, currentPoint.x).split("");
      right = lines[idx].slice(currentPoint.x + 1, lines[idx].length).split("");

      const leftScore = calculateDirectionScore(char, left, true);
      const rightScore = calculateDirectionScore(char, right);
      const [topScore, bottomScore] = calculateVerticalScores(
        char,
        currentPoint.x,
        currentPoint.y,
        lines
      );
      const totalScore = topScore * leftScore * rightScore * bottomScore;
      //console.log(
      //  char,
      //  topScore,
      //  leftScore,
      //  bottomScore,
      //  rightScore,
      //  totalScore
      //);

      if (totalScore > maxTreeScore) {
        maxTreeScore = totalScore;
      }

      currentPoint.x++;
    }
  }

  console.log(maxTreeScore);
}

async function partOne() {
  const lines = await getFileLines();

  // Add the edge trees initially
  let visibleTreeSum = lines[0].length * 2 + (lines.length - 2) * 2;
  for (let idx = 1; idx < lines.length - 1; idx++) {
    let currentPoint = { y: idx, x: 1 };
    let left = [];
    let right = [];
    for (let jdx = 1; jdx < lines[idx].length - 1; jdx++) {
      const char = parseInt(lines[idx][jdx]);
      left = lines[idx].slice(0, currentPoint.x).split("");
      right = lines[idx].slice(currentPoint.x + 1, lines[idx].length).split("");

      if (
        left.every((x) => parseInt(x) < char) ||
        right.every((x) => parseInt(x) < char) ||
        isVisibleVertically(char, currentPoint.x, currentPoint.y, lines)
      ) {
        visibleTreeSum++;
      }

      currentPoint.x++;
    }
  }

  console.log(visibleTreeSum);
}

partOne();
partTwo();
