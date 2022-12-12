const fs = require("fs/promises");
const path = require("path");

const getFile = async () => {
  const filePath = path.join(__dirname, "input.txt");

  return (await fs.readFile(filePath, { encoding: "utf8" }))
    .replace(/\r/g, "")
    .trim();
};

function print(node, depth = 0) {
  console.log(
    `${" ".repeat(depth * 2)}- ${node.name} (${
      node.isDirectory ? "dir" : `file, size=${node.size}`
    })`
  );
  if (node.isDirectory) {
    for (const child of node.children) {
      print(child, depth + 1);
    }
  }
}

function getSize(node, callback) {
  if (!node.isDirectory) {
    return node.size;
  }
  const dirSize = node.children
    .map((child) => getSize(child, callback))
    .reduce((a, b) => a + b, 0);

  callback(node.name, dirSize);

  return dirSize;
}

function createTree(lines) {
  const tree = {
    name: "/",
    isDirectory: true,
    size: 0,
    children: [],
  };

  let currentNode = tree;
  let currentCommand = null;

  for (const line of lines) {
    const parts = line.split(" ");

    if (parts[0] === "$") {
      currentCommand = parts[1];

      if (currentCommand === "cd") {
        const target = parts[2];

        switch (target) {
          case "/":
            currentNode = tree;
            break;
          case "..":
            currentNode = currentNode.parent;
            break;
          default:
            currentNode = currentNode.children.find(
              (node) => node.isDirectory && node.name === target
            );
            break;
        }
      }
    } else {
      if (currentCommand === "ls") {
        if (parts[0] === "dir") {
          const node = {
            name: parts[1],
            isDirectory: true,
            children: [],
            parent: currentNode,
          };
          currentNode.children.push(node);
        } else {
          const node = {
            name: parts[1],
            size: parseInt(parts[0]),
            isDirectory: false,
            parent: currentNode,
          };
          currentNode.children.push(node);
        }
      } else {
        throw new Error("unknown state");
      }
    }
  }
  return tree;
}

async function partTwo() {
  const file = await getFile();
  const lines = file.split("\n");

  const tree = createTree(lines);
  const availableDiskSpace = 70000000;
  const requiredUnusedSpaced = 30000000;
  let currentDiskSpace = 0;
  let diffs = [];

  getSize(tree, (name, size) => {
    if (name === "/") {
      currentDiskSpace = availableDiskSpace - size;
    }

    const diff = Math.abs(currentDiskSpace - size);

    diffs.push(diff + currentDiskSpace);
  });

  console.log(
    diffs
      .sort((a, b) => a - b)
      .filter((size) => size + currentDiskSpace >= requiredUnusedSpaced)
  );
}

async function partOne() {
  const file = await getFile();
  const lines = file.split("\n");

  const tree = createTree(lines);
  const targetSize = 100000;
  let dirSum = 0;

  getSize(tree, (name, size) => {
    if (size < targetSize) {
      dirSum += size;
    }
  });

  console.log(dirSum);
}

partTwo();
