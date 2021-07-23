import {
  updateBestResultGame,
  getBestResultGame,
} from "../../localStorage/bestResultGame";
class Snake {
  constructor(component) {
    this.component = component;

    this.direction = "ArrowRight";
    this.interval = null;
    this.prohibitionAbruptActions = true;

    this.bestResultGame = 0;
    this.total = 0;

    this.snakePiece = [];
    this.foodIndex = [];
    this.levels = [
      {
        title: "Тяжелый",
        speed: 200,
        grid: {
          x: 35,
          y: 25,
        },
        winScore: 40,
        startSnakeSize: 2,
        id: "hard",
      },
      {
        title: "Средний",
        speed: 400,
        grid: {
          x: 20,
          y: 15,
        },
        winScore: 25,
        startSnakeSize: 3,
        id: "normal",
      },
      {
        title: "Лёгкий",
        speed: 600,
        grid: {
          x: 10,
          y: 10,
        },
        winScore: 15,
        startSnakeSize: 4,
        id: "easy",
      },
    ];
  }

  // Меняем контекст
  setComponent(component) {
    this.component = component;
  }

  // Начало игры
  startGame() {
    this.component.startShow = false;
    this.component.gridShow = true;
    this.bindingControlKeys();

    this.zeroingTotalOfGame();
    this.creatingSnake();
    this.launchMovement();
    this.creatingFoodForSnake();
  }

  // Победа в игре
  winGame() {
    this.component.winGameShow = true;

    this.updateBestResult();
    this.resetTheGame();
  }

  // Проигрыш в игре
  endGame() {
    this.component.endGameShow = true;
    this.untyingControlKeys();

    this.updateBestResult();
    this.resetTheGame();
  }

  // Обнуляем игру
  resetTheGame() {
    clearInterval(this.interval);
    this.snakePiece = [];
    this.foodIndex = [];
    this.direction = "ArrowRight";
    this.component.gridShow = false;
  }

  // Меняем уровень сложности
  changeLevel(id) {
    this.levels.forEach((item) => {
      if (item.id === id) {
        this.component.speed = item.speed;
        this.component.grid = item.grid;
        this.component.winningScore = item.winScore;
        this.component.startSnakeSize = item.startSnakeSize;
      }
    });
  }

  // Изменяем результат игры ( total )
  changingResultOfGame() {
    this.total = this.snakePiece.length - this.component.startSnakeSize;
  }

  // Добавляем лучший результат игры
  addBestResult() {
    if (getBestResultGame()) {
      this.bestResultGame = getBestResultGame();
    }
  }

  // Обновляем лучший результат игры
  updateBestResult() {
    updateBestResultGame(this.total);
    this.bestResultGame = getBestResultGame();
  }

  // Обнуляем результат игры
  zeroingTotalOfGame() {
    this.total = 0;
  }

  // Запускаем движение змейки
  launchMovement() {
    this.interval = setInterval(() => {
      this.changingPosition();
      this.prohibitionAbruptActions = true;
    }, this.component.speed);
  }

  // Вызываем moveSnake()(Смена направления движения) если пользователь нажал одну из клавиш стрелка
  snakeMovements(event) {
    if (
      event.key != "ArrowRight" &&
      event.key != "ArrowLeft" &&
      event.key != "ArrowUp" &&
      event.key != "ArrowDown"
    ) {
      return;
    }

    this.moveSnake(event.key);
  }

  //  Проверяем не пытается ли пользователь сменить направление на противоположное
  checkDirectionToOpposite(direction) {
    if (this.prohibitionAbruptActions) {
      if (
        (this.direction === "ArrowRight" && direction === "ArrowLeft") ||
        (this.direction === "ArrowLeft" && direction === "ArrowRight") ||
        (this.direction === "ArrowUp" && direction === "ArrowDown") ||
        (this.direction === "ArrowDown" && direction === "ArrowUp")
      ) {
        return false;
      }

      return true;
    }
  }

  // Менем направление движения
  moveSnake(direction = "ArrowRight") {
    if (this.checkDirectionToOpposite(direction)) {
      this.direction = direction;
      this.prohibitionAbruptActions = false;
    }
  }

  // Изменяем позицию змейки
  changingPosition() {
    let headValueX = this.snakePiece[this.snakePiece.length - 1][0];
    let headValueY = this.snakePiece[this.snakePiece.length - 1][1];

    switch (this.direction) {
      case "ArrowRight":
        this.snakePiece.push([headValueX + 1, headValueY]);
        break;
      case "ArrowLeft":
        this.snakePiece.push([headValueX - 1, headValueY]);
        break;
      case "ArrowUp":
        this.snakePiece.push([headValueX, headValueY - 1]);
        break;
      case "ArrowDown":
        this.snakePiece.push([headValueX, headValueY + 1]);
        break;
    }

    if (!this.isCatchingFood()) {
      this.snakePiece.shift();
    }
  }

  // Привязываем клавиши управления
  bindingControlKeys() {
    document.addEventListener("keydown", this.snakeMovements.bind(this));
  }

  // Отвязываем клавиш управления
  untyingControlKeys() {
    document.removeEventListener("keydown", this.snakeMovements.bind(this));
  }

  // Создаём пищу для змейки в ранодомном месте
  creatingFoodForSnake() {
    const { x, y } = this.component.grid;

    let randomX = this.getRandomInRange(1, x);
    let randomY = this.getRandomInRange(1, y);

    // Проверяем свободна ли эта позиция
    let isCheckingIntersectionsWithHead = this.snakePiece.every((item) => {
      return !(item[0] === randomX && item[1] === randomY);
    });

    if (isCheckingIntersectionsWithHead) {
      this.foodIndex = [randomX, randomY];
      return;
    }

    this.creatingFoodForSnake();
  }

  // Создаём змейку в ранодомном месте
  creatingSnake() {
    const { x, y } = this.component.grid;
    let snakeIndexX = this.getRandomInRange(this.component.startSnakeSize, x);
    let snakeIndexY = this.getRandomInRange(1, y);

    for (let i = 0; i < this.component.startSnakeSize; i++) {
      this.snakePiece.push([
        snakeIndexX - this.component.startSnakeSize + i,
        snakeIndexY,
      ]);
    }
  }

  // Получаем рандомную координату
  getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Проверяем пересекается ли голова змейки с пищей
  isCheckingIntersectionsWithHead() {
    if (!this.snakePiece.length) return false;

    return (
      this.snakePiece[this.snakePiece.length - 1][0] === this.foodIndex[0] &&
      this.snakePiece[this.snakePiece.length - 1][1] === this.foodIndex[1]
    );
  }

  // Генерируем новую пищу и увеличиваем результат игры если змейка поймала пищу
  isCatchingFood() {
    if (this.isCheckingIntersectionsWithHead()) {
      this.changingResultOfGame();
      this.creatingFoodForSnake();
      return true;
    }

    return false;
  }

  // Проверяем нет ли пересечений между головой и частью тела змейки
  checkingSectionOfHeadAndBody() {
    const headSnake = this.snakePiece[this.snakePiece.length - 1];

    for (let i = 0; i < this.snakePiece.length - 1; i++) {
      if (
        headSnake[0] === this.snakePiece[i][0] &&
        headSnake[1] === this.snakePiece[i][1]
      ) {
        this.endGame();
      }
    }
  }

  // Заканчиваем игру если змейка пересекает сама себя
  endGameIfHeadIntersectsWithBody() {
    if (this.checkingSectionOfHeadAndBody()) {
      this.endGame();
    }
  }

  // Вызываем функцию winGame() если игрок набрал победный счёт
  checkingWhetherUserHasWonGame() {
    if (this.total >= this.component.winningScore) this.winGame();
  }

  // Определение позиций элементов всего туловища змейки
  isPositionOfSnakeBody(x, y) {
    if (!this.foodIndex.length) {
      return false;
    }

    return this.snakePiece.some((item) => {
      return item[0] === x && item[1] === y;
    });
  }

  // Определение позиции головы змейки
  isPositionOfSnakeHead(x, y) {
    if (!this.foodIndex.length) {
      return false;
    }
    return (
      this.snakePiece[this.snakePiece.length - 1][0] === x &&
      this.snakePiece[this.snakePiece.length - 1][1] === y
    );
  }

  // Определение позиций элементов туловища змейки без головы
  isPositionOfSnakePieceBody(x, y) {
    if (!this.foodIndex.length) {
      return false;
    }

    let snakePieceWithoutLastElement = this.snakePiece.slice(0, -1);

    return snakePieceWithoutLastElement.some((item) => {
      return item[0] === x && item[1] === y;
    });
  }

  // Определение позиции пищи для змейки
  isPositionOfFoodForSnake(x, y) {
    if (!this.foodIndex.length) {
      return false;
    }

    return x === this.foodIndex[0] && y === this.foodIndex[1];
  }

  // Меняем позицию змейки если она вышла за пределы сетки
  changingPositionIfItOutsideGrid(newValue) {
    const { x, y } = this.component.grid;
    let headValueX = newValue[newValue.length - 1][0];
    let headValueY = newValue[newValue.length - 1][1];

    if (headValueX > x) this.snakePiece[this.snakePiece.length - 1][0] = 1;
    if (headValueX < 1) this.snakePiece[this.snakePiece.length - 1][0] = x;

    if (headValueY > y) this.snakePiece[this.snakePiece.length - 1][1] = 1;
    if (headValueY < 1) this.snakePiece[this.snakePiece.length - 1][1] = y;
  }
}

const snake = new Snake();

export default snake;
