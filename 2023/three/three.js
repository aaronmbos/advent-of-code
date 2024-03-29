const { loadInput } = require("../../inputLoader");

async function partOne() {
  const lines = (await loadInput("2023", "three")).split("\n");

  const numberMap = new Map();
  const symbolMap = new Map();
  for (let rowIdx = 0; rowIdx < lines.length; rowIdx++) {
    //console.log(`\nLine ${rowIdx}:`);
    const line = lines[rowIdx].trim();

    let tmpNumber = [];
    for (let colIdx = 0; colIdx < line.length; colIdx++) {
      char = line[colIdx];

      if (isSymbol(char)) {
        //console.log(char, `[${rowIdx},${colIdx}]`);
        if (tmpNumber.length > 0) {
          const entry = createNumberEntry(tmpNumber);
          setOrAppendMap(numberMap, rowIdx, entry);
          //console.log(numberMap);
          tmpNumber = [];
        }
        setOrAppendMap(symbolMap, rowIdx, { char, colIdx });
        //console.log(symbolMap);
        continue;
      }

      if (isNumber(char)) {
        tmpNumber.push({ val: char, col: colIdx });
        //console.log(char, `[${rowIdx},${colIdx}]`);
        if (colIdx === line.length - 1) {
          const entry = createNumberEntry(tmpNumber);
          setOrAppendMap(numberMap, rowIdx, entry);
          tmpNumber = [];
        }
        continue;
      }

      if (tmpNumber.length > 0) {
        const entry = createNumberEntry(tmpNumber);
        setOrAppendMap(numberMap, rowIdx, entry);
        tmpNumber = [];
      }
    }
  }

  const adjacentNumbers = [];
  // Iterate through number map to see if there are adjacent items in symbol map
  for (const [row, numbers] of numberMap) {
    numbers.forEach((num) => {
      // Check in same row
      if (sameRowCheck(num, symbolMap.get(row))) {
        adjacentNumbers.push(num.val);
        return;
      }
      //console.log(sameRowCheck(num, symbols));
      // Check in row above
      if (checkAboveOrBelow(num, symbolMap.get(row - 1))) {
        adjacentNumbers.push(num.val);
        return;
      }
      // Check in row below
      if (checkAboveOrBelow(num, symbolMap.get(row + 1))) {
        adjacentNumbers.push(num.val);
        return;
      }
      //console.log(num);
    });
  }
  //console.table(adjacentNumbers);
  console.log(adjacentNumbers.reduce((a, b) => a + b, 0));
}

async function partTwo() {
  const lines = (await loadInput("2023", "three")).split("\n");

  const numberMap = new Map();
  const gearMap = new Map();
  for (let rowIdx = 0; rowIdx < lines.length; rowIdx++) {
    //console.log(`\nLine ${rowIdx}:`);
    const line = lines[rowIdx].trim();

    let tmpNumber = [];
    for (let colIdx = 0; colIdx < line.length; colIdx++) {
      char = line[colIdx];

      if (isGear(char)) {
        //console.log(char, `[${rowIdx},${colIdx}]`);
        if (tmpNumber.length > 0) {
          const entry = createNumberEntry(tmpNumber);
          setOrAppendMap(numberMap, rowIdx, entry);
          //console.log(numberMap);
          tmpNumber = [];
        }
        setOrAppendMap(gearMap, rowIdx, { char, colIdx });
        //console.log(gearMap);
        continue;
      }

      if (isNumber(char)) {
        tmpNumber.push({ val: char, col: colIdx });
        //console.log(char, `[${rowIdx},${colIdx}]`);
        if (colIdx === line.length - 1) {
          const entry = createNumberEntry(tmpNumber);
          setOrAppendMap(numberMap, rowIdx, entry);
          tmpNumber = [];
        }
        continue;
      }

      if (tmpNumber.length > 0) {
        const entry = createNumberEntry(tmpNumber);
        setOrAppendMap(numberMap, rowIdx, entry);
        tmpNumber = [];
      }
    }
  }

  const gearRatios = [];
  // Iterate through gears to see if there are adjacent numbers
  for (const [row, gears] of gearMap) {
    gears.forEach((gear) => {
      //console.log(gear);
      const adjacentNums = [];
      const left = numberMap
        .get(row)
        .find((num) => num.maxCol === gear.colIdx - 1);

      const right = numberMap
        .get(row)
        .find((num) => num.minCol === gear.colIdx + 1);

      const above = numberMap.get(row - 1).find((num) => {
        //0123456
        //  789
        // x
        return num.minCol - 1 <= gear.colIdx && num.maxCol + 1 >= gear.colIdx;
      });

      const below = numberMap.get(row + 1).find((num) => {
        //0123456
        //     x
        //  789
        return num.minCol - 1 <= gear.colIdx && num.maxCol + 1 >= gear.colIdx;
      });

      if (left) {
        adjacentNums.push(left.val);
      }
      if (right) {
        adjacentNums.push(right.val);
      }
      if (above) {
        adjacentNums.push(above.val);
      }
      if (below) {
        adjacentNums.push(below.val);
      }

      //gearRatios.push(adjacentNums.reduce((a, b) => a * b, 1));
      if (adjacentNums.length === 2) {
        gearRatios.push(adjacentNums.reduce((a, b) => a * b, 1));
      }
    });
  }
  //console.log(numberMap);
  //console.table(gearRatios);
  console.log(gearRatios.reduce((a, b) => a + b, 0));
}

function setOrAppendMap(map, rowIdx, entry) {
  if (map.has(rowIdx)) {
    map.set(rowIdx, map.get(rowIdx).concat([entry]));
  } else {
    map.set(rowIdx, [entry]);
  }
}

function createNumberEntry(tmpNumber) {
  const val = parseInt(tmpNumber.map((n) => n.val).join(""));
  const minCol = Math.min(...tmpNumber.map((n) => n.col));
  const maxCol = Math.max(...tmpNumber.map((n) => n.col));

  return {
    val,
    minCol,
    maxCol,
  };
}

function checkAboveOrBelow(num, symbols) {
  if (!symbols) {
    return false;
  }

  for (const symbol of symbols) {
    if (num.minCol - 1 <= symbol.colIdx && num.maxCol + 1 >= symbol.colIdx) {
      return true;
    }
  }

  return false;
}

function sameRowCheck(num, symbols) {
  if (!symbols) {
    return false;
  }

  return symbols.some((symbol) => {
    if (num.minCol - 1 === symbol.colIdx || num.maxCol + 1 === symbol.colIdx) {
      return true;
    }
    return false;
  });
}

function isNumber(char) {
  return !isNaN(parseInt(char));
}

function isSymbol(char) {
  return !isNumber(char) && char !== ".";
}

function isGear(char) {
  return char === "*";
}

Promise.resolve(partTwo());
