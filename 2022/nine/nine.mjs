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

function handleAction(direction, count, rope) {
  for (let idx = 1; idx <= count; idx++) {
    moveHead(direction, rope[0]);
    for (let ropeIdx = 1; ropeIdx < rope.length; ropeIdx++) {
      if (areTouching(rope[ropeIdx - 1], rope[ropeIdx])) {
        break;
      }
      moveTail(rope[ropeIdx - 1], rope[ropeIdx]);
    }
  }
}

function moveTail(head, tail) {
  const xDelta = head.current[0] - tail.current[0];
  const yDelta = head.current[1] - tail.current[1];

  if (xDelta !== 0 && yDelta !== 0) {
    if (xDelta > 0 && yDelta > 0) {
      tail.current = [tail.current[0] + 1, tail.current[1] + 1];
    } else if (xDelta > 0 && yDelta < 0) {
      tail.current = [tail.current[0] + 1, tail.current[1] - 1];
    } else if (xDelta < 0 && yDelta < 0) {
      tail.current = [tail.current[0] - 1, tail.current[1] - 1];
    } else if (xDelta < 0 && yDelta > 0) {
      tail.current = [tail.current[0] - 1, tail.current[1] + 1];
    }
  } else if (xDelta !== 0) {
    tail.current =
      xDelta > 0
        ? [tail.current[0] + 1, tail.current[1]] // right
        : [tail.current[0] - 1, tail.current[1]]; // left
  } else if (yDelta !== 0) {
    tail.current =
      yDelta > 0
        ? [tail.current[0], tail.current[1] + 1] // up
        : [tail.current[0], tail.current[1] - 1]; // down
  } else {
    throw new Error("Unknown tail movement");
  }
  if (
    !tail.history.find((point) => {
      return tail.current[0] === point[0] && tail.current[1] === point[1];
    })
  ) {
    tail.history.push(tail.current);
  }
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
}

function areTouching(head, tail) {
  if (Math.abs(head.current[0] - tail.current[0]) > 1) {
    return false;
  }

  if (Math.abs(head.current[1] - tail.current[1]) > 1) {
    return false;
  }
  return true;
}

async function run(knots) {
  const lines = await getFileLines();
  const actions = getActions(lines);

  let rope = [];
  for (let i = 0; i < knots; i++) {
    rope.push({
      current: [0, 0],
      history: [[0, 0]],
    });
  }
  for (const action of actions) {
    handleAction(action.direction, action.count, rope);
  }
  console.log(rope[knots - 1].history.length);
}

await run(2); // part 1
await run(10); // part 2
