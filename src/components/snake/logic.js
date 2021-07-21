class Snake {
  // получаем рандомное число
  getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Привязка клавиш управления
  bindingControlKeys(vue) {
    document.addEventListener("keydown", vue.snakeMovements);
  }

  // Отвязываем клавиш управления
  untyingControlKeys(vue) {
    document.removeEventListener("keydown", vue.snakeMovements);
  }

  // Изменения позиции змейки
  changingPosition(vue) {
    let headValueX = vue.snakePiece[vue.snakePiece.length - 1][0];
    let headValueY = vue.snakePiece[vue.snakePiece.length - 1][1];

    switch (vue.direction) {
      case "ArrowRight":
        vue.snakePiece.push([headValueX + 1, headValueY]);
        break;
      case "ArrowLeft":
        vue.snakePiece.push([headValueX - 1, headValueY]);
        break;
      case "ArrowUp":
        vue.snakePiece.push([headValueX, headValueY - 1]);
        break;
      case "ArrowDown":
        vue.snakePiece.push([headValueX, headValueY + 1]);
        break;
    }

    if (!vue.isCatchingFood()) {
      vue.snakePiece.shift();
    }
  }
}

const snake = new Snake();

export default snake;
