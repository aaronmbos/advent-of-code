const { loadInput } = require("../../inputLoader");

async function partOne() {
  const lines = (await loadInput("2023", "four")).split("\n");
  const cards = lines.map((line) => {
    const [label, numbers] = line.split(":");
    const cardNum = parseInt(label.split(" ")[1]);
    let [winningNumbers, myNumbers] = numbers.split("|");
    winningNumbers = winningNumbers
      .trim()
      .split(" ")
      .filter((num) => num)
      .map((num) => parseInt(num.trim()));
    myNumbers = myNumbers
      .trim()
      .split(" ")
      .filter((num) => num)
      .map((num) => parseInt(num.trim()));

    return {
      cardNum,
      winningNumbers,
      myNumbers,
    };
  });

  const total = cards
    .map((card) => {
      let matches = 0;
      for (let num of card.myNumbers) {
        if (card.winningNumbers.includes(num)) {
          matches++;
        }
      }
      if (matches === 0) {
        return matches;
      }
      return Math.pow(2, matches - 1);
    })
    .reduce((a, b) => a + b, 0);

  console.log(total);
}

async function partTwo() {
  const lines = (await loadInput("2023", "four")).split("\n");
  const cards = lines.map((line) => {
    const [label, numbers] = line.split(":");
    const cardNum = parseInt(label.split(" ").filter((num) => num)[1]);
    let [winningNumbers, myNumbers] = numbers.split("|");
    winningNumbers = winningNumbers
      .trim()
      .split(" ")
      .filter((num) => num)
      .map((num) => parseInt(num.trim()));
    myNumbers = myNumbers
      .trim()
      .split(" ")
      .filter((num) => num)
      .map((num) => parseInt(num.trim()));

    return {
      cardNum,
      winningNumbers,
      myNumbers,
      copies: 1,
    };
  });

  for (let cardIdx = 0; cardIdx < cards.length; cardIdx++) {
    const card = cards[cardIdx];
    for (let idx = 0; idx < card.copies; idx++) {
      let matches = 0;
      for (let num of card.myNumbers) {
        if (card.winningNumbers.includes(num)) {
          matches++;
        }
      }
      //console.log(card.cardNum, matches);
      if (matches === 0) {
        break;
      }
      for (let matchIdx = 1; matchIdx <= matches; matchIdx++) {
        //console.log(matchIdx);
        let cardToUpdate = cards.find(
          (c) => c.cardNum === card.cardNum + matchIdx
        );
        if (cardToUpdate) {
          cardToUpdate.copies = cardToUpdate.copies + 1;
          //console.log(cardToUpdate);
        }
      }
    }
  }
  const total = cards.map((card) => card.copies).reduce((a, b) => a + b, 0);
  console.log(total);
  //console.table(cards.map((card) => card.cardNum));
}

Promise.resolve(partTwo());
