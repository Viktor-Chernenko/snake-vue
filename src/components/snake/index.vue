<template>
  <div class="snake">
    <start-game
      :bestResultGame="bestResultGame"
      :startShow="startShow"
      :levels="levels"
      @changeLevel="changeLevel"
      @startGame="startGame"
    />

    <end-game
      :endGameShow="endGameShow"
      :total="total"
      @startOver="showLevelSelection"
    />

    <win-game :winGameShow="winGameShow" @startOver="showLevelSelection" />

    <div
      class="snake-field"
      :style="{ width: widthSnakeField + 'px' }"
      v-if="snakeFieldShow"
    >
      <template v-for="(item, i) in createGrid">
        <div
          ref="gridItem"
          :key="i"
          :data-X="item.x"
          :data-Y="item.y"
          class="snake-field__item"
          :class="{
            food: isPositionOfFoodForSnake(item.x, item.y),
            'snake-body__item': isPositionOfSnakeBody(item.x, item.y),
            'snake-body-piece': isPositionOfSnakePieceBody(item.x, item.y),
            'snake-body-head': isPositionOfSnakeHead(item.x, item.y),
          }"
          :style="{ width: gridItemSize + 'px', height: gridItemSize + 'px' }"
        ></div>
      </template>
      <div class="logo">
        <img src="../../assets/snake-img.svg" alt="logo" />
      </div>
    </div>

    <mobile-control @directionOfMovement="moveSnake" />
  </div>
</template>

<script>
import {
  updateBestResultGame,
  getBestResultGame,
} from "../../localStorage/bestResultGame";

import startGame from "./startGame.vue";
import endGame from "./endGame.vue";
import winGame from "./winGame.vue";
import mobileControl from "./mobileControl.vue";

export default {
  name: "Snake",

  components: {
    startGame,
    endGame,
    winGame,
    mobileControl,
  },

  data: () => {
    return {
      snakePiece: [],
      startSnakeSize: 4,
      foodIndex: [],
      grid: { x: 10, y: 10 },
      direction: "ArrowRight",
      defaultGridItemSize: 80,
      startShow: true,
      speed: 600,
      prohibitionAbruptActions: true,
      total: 0,
      winningScore: 15,
      snakeFieldShow: false,
      endGameShow: false,
      winGameShow: false,
      bestResultGame: 0,
      interval: null,
      levels: [
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
      ],
    };
  },

  methods: {
    // Создаём пищу для змейки в ранодомном месте
    creatingFoodForSnake() {
      const { x, y } = this.grid;

      let randomX = this.getRandomInRange(1, x);
      let randomY = this.getRandomInRange(1, y);

      let isCheckingIntersectionsWithHead = this.snakePiece.every((item) => {
        return !(item[0] === randomX && item[1] === randomY);
      });

      if (isCheckingIntersectionsWithHead) {
        this.foodIndex = [randomX, randomY];
        return;
      }

      this.creatingFoodForSnake();
    },

    // Создаём змейку в ранодомном месте
    creatingSnake() {
      const { x, y } = this.grid;
      let snakeIndexX = this.getRandomInRange(this.startSnakeSize, x);
      let snakeIndexY = this.getRandomInRange(1, y);

      for (let i = 0; i < this.startSnakeSize; i++) {
        this.snakePiece.push([
          snakeIndexX - this.startSnakeSize + i,
          snakeIndexY,
        ]);
      }
    },

    // определение направления движения змейки
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
    },

    // Запуск движение змейки
    launchMovement() {
      this.interval = setInterval(() => {
        this.changingPosition();

        this.prohibitionAbruptActions = true;
      }, this.speed);
    },

    // Изменения позиции змейки
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
    },

    // Смена направления движения
    moveSnake(value = "ArrowRight") {
      if (this.prohibitionAbruptActions) {
        if (
          (this.direction === "ArrowRight" && value === "ArrowLeft") ||
          (this.direction === "ArrowLeft" && value === "ArrowRight") ||
          (this.direction === "ArrowUp" && value === "ArrowDown") ||
          (this.direction === "ArrowDown" && value === "ArrowUp")
        ) {
          return;
        }

        this.direction = value;

        this.prohibitionAbruptActions = false;
      }
    },

    // Определение позиции пищи для змейки
    isPositionOfFoodForSnake(x, y) {
      if (!this.foodIndex.length) {
        return false;
      }
      return x === this.foodIndex[0] && y === this.foodIndex[1];
    },

    // Определение позиции головы змейки
    isPositionOfSnakeHead(x, y) {
      if (!this.foodIndex.length) {
        return false;
      }
      return (
        this.snakePiece[this.snakePiece.length - 1][0] === x &&
        this.snakePiece[this.snakePiece.length - 1][1] === y
      );
    },

    // Определение позиции туловища змейки без головы
    isPositionOfSnakePieceBody(x, y) {
      if (!this.foodIndex.length) {
        return false;
      }

      let snakePieceWithoutLastElement = this.snakePiece.slice(0, -1);

      return snakePieceWithoutLastElement.some((item) => {
        return item[0] === x && item[1] === y;
      });
    },

    // Определение всего туловища змейки
    isPositionOfSnakeBody(x, y) {
      if (!this.foodIndex.length) {
        return false;
      }

      return this.snakePiece.some((item) => {
        return item[0] === x && item[1] === y;
      });
    },

    // Проверка поймана ли пища змейкой
    isCatchingFood() {
      if (this.isCheckingIntersectionsWithHead) {
        this.changingResultOfGame();
        this.creatingFoodForSnake();
        return true;
      }

      return false;
    },

    // Начало игры
    startGame() {
      this.startShow = false;
      this.snakeFieldShow = true;

      this.zeroingTotalOfGame();
      this.creatingSnake();
      this.launchMovement();
      this.creatingFoodForSnake();
    },

    // Проигрыш в игре
    endGame() {
      this.endGameShow = true;

      this.updateBestResult();
      this.resetTheGame();
    },

    // Победа в игре
    winGame() {
      this.winGameShow = true;

      this.updateBestResult();
      this.resetTheGame();
    },

    //  перейти к выбору уровня
    showLevelSelection() {
      this.endGameShow = false;
      this.winGameShow = false;

      this.startShow = true;
    },

    // обнуление игры
    resetTheGame() {
      clearInterval(this.interval);
      this.snakePiece = [];
      this.foodIndex = [];
      this.direction = "ArrowRight";
      this.snakeFieldShow = false;
    },

    // обнуление счёта игры
    zeroingTotalOfGame() {
      this.total = 0;
    },

    updateBestResult() {
      updateBestResultGame(this.total);
      this.bestResultGame = getBestResultGame();
    },

    // Смена уровня сложности
    changeLevel(id) {
      this.levels.forEach((item) => {
        if (item.id === id) {
          this.speed = item.speed;
          this.grid = item.grid;
          this.winningScore = item.winScore;
          this.startSnakeSize = item.startSnakeSize;
        }
      });
    },

    // получаем рандомное число
    getRandomInRange(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Смена позиции змейки если она вышла за пределы сетки
    changingPositionIfItOutsideGrid(newValue) {
      const { x, y } = this.grid;
      let headValueX = newValue[newValue.length - 1][0];
      let headValueY = newValue[newValue.length - 1][1];

      if (headValueX > x) this.snakePiece[this.snakePiece.length - 1][0] = 1;
      if (headValueX < 1) this.snakePiece[this.snakePiece.length - 1][0] = x;

      if (headValueY > y) this.snakePiece[this.snakePiece.length - 1][1] = 1;
      if (headValueY < 1) this.snakePiece[this.snakePiece.length - 1][1] = y;
    },

    // Проверяем нет ли пересечений между головой и части тела змейки
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
    },

    // Проверка победил ли пользователь в игре
    checkingWhetherUserHasWonGame() {
      if (this.total >= this.winningScore) this.winGame();
    },

    // Изменение результата игры ( total )
    changingResultOfGame() {
      this.total = this.snakePiece.length - this.startSnakeSize;
    },
  },

  computed: {
    // формирование сетки
    createGrid() {
      const { x, y } = this.grid;
      const grid = [];

      for (let iY = 1; iY <= y; iY++) {
        for (let iX = 1; iX <= x; iX++) {
          grid.push({
            x: iX,
            y: iY,
          });
        }
      }

      return grid;
    },

    // размер элемента сетки
    gridItemSize() {
      const { x, y } = this.grid;
      const largerNumber = Math.max(x, y);
      const widthWindow = window.innerWidth;

      const gridItemSize =
        widthWindow < 550
          ? this.defaultGridItemSize / 3
          : widthWindow < 700
          ? this.defaultGridItemSize / 2
          : this.defaultGridItemSize;

      if (largerNumber > 10) {
        return (gridItemSize / largerNumber) * 12;
      }

      return gridItemSize;
    },

    // ширина сетки
    widthSnakeField() {
      const { x } = this.grid;

      return this.gridItemSize * x;
    },

    // Проверка пересекается ли голова змейки с пищей
    isCheckingIntersectionsWithHead() {
      if (!this.snakePiece.length) return false;

      return (
        this.snakePiece[this.snakePiece.length - 1][0] === this.foodIndex[0] &&
        this.snakePiece[this.snakePiece.length - 1][1] === this.foodIndex[1]
      );
    },
  },

  watch: {
    snakePiece(newValue) {
      if (!newValue.length) return;

      this.changingPositionIfItOutsideGrid(newValue);
      this.checkingSectionOfHeadAndBody();
      this.checkingWhetherUserHasWonGame();

      this.isCatchingFood();
    },
  },

  mounted() {
    // Привязка движения змейки к стрелкам клавиатуры
    document.addEventListener("keydown", this.snakeMovements);

    this.bestResultGame = getBestResultGame();
  },

  beforeDestroy() {
    document.removeEventListener("keydown", this.snakeMovements);
  },
};
</script>

<style scoped lang="scss">
.snake {
  position: relative;
  height: calc(100vh - 30px);
  width: 100vw;
  padding: 15px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: var(--color-5);

  &-field {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    background: var(--color-5);
    border: 2px solid var(--color-1);
    border-radius: 3%;

    &__item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: 1px;
      z-index: 1;

      &::before {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 30%;
        content: "";
      }
    }
  }

  .food {
    &::before {
      background: var(--color-4);
    }
  }

  &-body {
    &-piece {
      &::before {
        background: var(--color-3);
      }
    }

    &-head {
      z-index: 1;

      &::before {
        background: var(--color-1);
      }

      &.food {
        &::before {
          background: var(--color-1);
        }
      }
    }
  }
}

.logo {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  right: 0;
  width: 40%;
  margin: 0 auto;

  img {
    width: 100%;
  }
}
</style>
