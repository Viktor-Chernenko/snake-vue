export function updateBestResultGame(total) {
  console.log(getBestResultGame(), total);
  if (total < getBestResultGame() && getBestResultGame()) {
    return;
  }

  localStorage.setItem("bestResultGame", total);
}

export function getBestResultGame() {
  let bestResultGame = localStorage.getItem("bestResultGame") || false;

  return bestResultGame;
}
