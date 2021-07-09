export function updateBestResultGame(total) {
  localStorage.setItem("bestResultGame", total);
}

export function getBestResultGame() {
  let bestResultGame = localStorage.getItem("bestResultGame") || false;

  return bestResultGame;
}
