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
      // Check beside
      const [left, right] = sameRowGearCheck(gear, numberMap.get(row));
      if (left > 0 && right > 0) {
        gearRatios.push(left * right);
        return;
      }
      // Check above
      const numberAbove = checkGearAboveOrBelow(gear, numberMap.get(row - 1));
      // Check below
      const numberBelow = checkGearAboveOrBelow(gear, numberMap.get(row + 1));

      if (numberAbove > 0 && numberBelow > 0) {
        gearRatios.push(numberAbove * numberBelow);
        return;
      }

      if (left > 0) {
        if (numberAbove > 0) {
          gearRatios.push(left * numberAbove);
          return;
        }
        if (numberBelow > 0) {
          gearRatios.push(left * numberBelow);
          return;
        }
      }
      if (right > 0) {
        if (numberAbove > 0) {
          gearRatios.push(right * numberAbove);
          return;
        }
        if (numberBelow > 0) {
          gearRatios.push(right * numberBelow);
          return;
        }
      }
    });
  }
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

function checkGearAboveOrBelow(gear, numbers) {
  if (!numbers) {
    return 0;
  }

  // 012345
  //   123
  //    x
  //  456
  number = 0;
  numbers.forEach((num) => {
    for (let idx = num.minCol - 1; idx <= num.maxCol + 1; idx++) {
      if (gear.colIdx === idx) {
        //console.log(num.val);
        number = num.val;
        return;
      }
    }
  });

  return number;
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

function sameRowGearCheck(gear, numbers) {
  if (!numbers) {
    return [0, 0];
  }

  // 0123456
  //  28*123
  const left = numbers.find((num) => num.maxCol === gear.colIdx - 1);
  const right = numbers.find((num) => num.minCol === gear.colIdx + 1);

  return [left?.val ?? 0, right?.val ?? 0];
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
