// Если новый результат больше лучшего то обновляем лучший результат
export function updateBestResultGame(total) {
  if (total < getBestResultGame() && getBestResultGame()) {
    return;
  }

  localStorage.setItem("bestResultGame", total);
}

// Получаем лучший результат
export function getBestResultGame() {
  return localStorage.getItem("bestResultGame") || 0;
}
