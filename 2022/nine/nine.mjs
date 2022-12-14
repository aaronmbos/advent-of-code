import { readFile } from "fs/promises";
import { join } from "path";

async function getFileLines() {
  const filePath = join(process.cwd(), "input.txt");

  return (await readFile(filePath, { encoding: "utf8" }))
    .replace(/\r/g, "")
    .trim()
    .split("\n");
}

function getActions(lines) {
  return lines.map((line) => {
    const [direction, count] = line.split(" ");
    return {
      direction: direction,
      count: parseInt(count),
    };
  });
}

function handleAction(direction, count, head, tail) {
  // if H is directly up, down, left, or right then T moves one step in that direction
  // if H is in different row or column then T moves one step diagnally
  for (let idx = 1; idx <= count; idx++) {
    moveHead(direction, head);
    if (areTouching(head, tail)) {
      continue;
    }
    moveTail(head, tail);
  }
}

function moveTail(head, tail) {
  // this is incorrect
  let xDelta = head.current[0] - tail.current[0];
  xDelta = xDelta === 0 ? 0 : xDelta - 1;
  let yDelta = head.current[1] - tail.current[1];
  yDelta = yDelta === 0 ? 0 : yDelta - 1;
  tail.current = [tail.current[0] + xDelta, tail.current[1] + yDelta];

  tail.history.push(tail.current);
  //console.log("tail", tail);
}

function moveHead(direction, head) {
  switch (direction) {
    case "U":
      head.current = [head.current[0], head.current[1] + 1];
      break;
    case "R":
      head.current = [head.current[0] + 1, head.current[1]];
      break;
    case "D":
      head.current = [head.current[0], head.current[1] - 1];
      break;
    case "L":
      head.current = [head.current[0] - 1, head.current[1]];
      break;
    default:
      throw new Error("Unknown head direction");
  }
  head.history.push(head.current);
  //console.log("head", head);
}

function areTouching(head, tail) {
  if (
    Math.abs(head.current[0] - tail.current[0]) <= 1 &&
    Math.abs(head.current[1] - tail.current[1] <= 1)
  ) {
    return true;
  }
  return false;
}

async function partOne() {
  const lines = await getFileLines();
  const actions = getActions(lines);

  let head = {
    current: [0, 0],
    history: [[0, 0]],
  };

  let tail = {
    current: [0, 0],
    history: [[0, 0]],
  };
  for (const action of actions) {
    handleAction(action.direction, action.count, head, tail);
  }
  console.log(tail);
  console.log(tail.history.length);
}

partOne();
