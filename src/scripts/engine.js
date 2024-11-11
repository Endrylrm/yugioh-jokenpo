const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreElement: document.getElementById("score-points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  playerSides: {
    player: "player-cards",
    playerElement: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerElement: document.querySelector("#computer-cards"),
  },
  actions: {
    nextDuelButton: document.getElementById("next-duel"),
  },
};

const pathImages = "src/assets/icons";

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}/dragon.png`,
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}/magician.png`,
    winOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}/exodia.png`,
    winOf: [0],
    loseOf: [1],
  },
];

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);

  return cardData[randomIndex].id;
}

async function createCardImage(cardId, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("data-id", cardId);
  cardImage.classList.add("card");

  if (fieldSide === state.playerSides.player) {
    cardImage.setAttribute("src", `${cardData[cardId].img}`);

    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });

    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(cardId);
    });
  } else {
    cardImage.setAttribute("src", `${pathImages}/card-back.png`);
  }

  return cardImage;
}

async function drawSelectCard(cardId) {
  state.cardSprites.avatar.src = cardData[cardId].img;
  state.cardSprites.name.innerText = cardData[cardId].name;
  state.cardSprites.type.innerText = "Attribute: " + cardData[cardId].type;
}

async function setCardsField(cardId) {
  await removeAllCardsImages();

  let computerCardId = await getRandomCardId();

  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";

  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

  let duelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore();
  await drawNextDuelButton(duelResults);
}

async function removeAllCardsImages() {
  let { computerElement, playerElement } = state.playerSides;
  let imgElements = computerElement.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());

  imgElements = playerElement.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

async function checkDuelResults(cardId, cpuCardId) {
  let duelResults = "draw";

  let playerCard = cardData[cardId];

  if (playerCard.winOf.includes(cpuCardId)) {
    duelResults = "win";
    state.score.playerScore++;

    await playAudio("win.wav");
  }

  if (playerCard.loseOf.includes(cpuCardId)) {
    duelResults = "lose";
    state.score.computerScore++;

    await playAudio("lose.wav");
  }

  return duelResults;
}

async function drawCards(numberOfCards, fieldSide) {
  for (let i = 0; i < numberOfCards; i++) {
    const randomCardId = await getRandomCardId();
    const cardImage = await createCardImage(randomCardId, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }

  await playAudio("draw-cards.mp3");
}

async function updateScore() {
  state.score.scoreElement.innerHTML = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawNextDuelButton(duelResult) {
  state.actions.nextDuelButton.innerText = duelResult.toUpperCase();
  state.actions.nextDuelButton.style.display = "block";
}

async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "Selecione";
  state.cardSprites.type.innerText = "uma carta";

  state.actions.nextDuelButton.style.display = "none";

  state.fieldCards.computer.style.display = "none";
  state.fieldCards.player.style.display = "none";

  init();
}

async function playAudio(audioName) {
  const audio = new Audio(`src/assets/audios/${audioName}`);
  audio.play();
}

function init() {
  drawCards(5, state.playerSides.player);
  drawCards(5, state.playerSides.computer);
}

init();
