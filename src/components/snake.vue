<template>
  <div class="snake">
    <div class="snake-field">
      <div class="start-game" v-if="startShow">
        <div v-if="bestResultGame" class="best-result-game">
          Ваш лучший результат:
          <span class="best-result-game__total">{{ bestResultGame }}</span>
        </div>
        <div class="start-game__title">Выберите уровень сложности:</div>
        <form class="form">
          <div class="form__item" v-for="(item, index) in levels" :key="index">
            <label
              ><span
                class="form__title"
                :class="{
                  active: item.value === speed,
                }"
                >{{ item.title }}</span
              >
              <input
                class="form__input"
                v-model="speed"
                :value="item.value"
                type="radio"
                name="level"
              />
            </label>
          </div>
          <button class="form__btn btn-start" @click.prevent="startGame">
            НАЧАТЬ
          </button>
        </form>

        <div class="start-game-info" v-if="this.widthWindow > 1024">
          <div class="start-game-info__title">Управление:</div>
          <img
            src="../assets/controls.png"
            alt="keyboard arrow controls"
            class="start-game-info__img"
          />
        </div>
      </div>

      <div class="snake-total-points" v-if="endGameShow">
        <div class="snake-total-points__item">
          <span class="snake-total-points__msg">ВЫ ПРОИГРАЛИ</span>
        </div>
        <div class="snake-total-points__item">
          <span class="snake-total-points__title">ВАШ РЕЗУЛЬТАТ:</span>
          <span class="snake-total-points__number">{{ total }}</span>
        </div>
        <button
          class="restart-btn"
          @click.prevent="(endGameShow = false), (startShow = true)"
        >
          НАЧАТЬ ЗАНОВО
        </button>
      </div>
      <div class="snake-win" v-if="winGameShow">
        <div class="snake-win__title">Поздравляю</div>
        <div class="snake-win__text">Вы выйграли +1 к карме</div>
        <button
          class="restart-btn"
          @click.prevent="(winGameShow = false), (startShow = true)"
        >
          НАЧАТЬ ЗАНОВО
        </button>
      </div>
      <template v-for="(item, i) in numberCells">
        <div
          class="snake-field__item"
          :key="i"
          :data-X="coordinateX(i)"
          :data-Y="coordinateY(i)"
          :class="{
            food:
              coordinateX(i) === foodIndex[0] &&
              coordinateY(i) === foodIndex[1],
            'snake-body__item': snakeBody(coordinateX(i), coordinateY(i)),
            'snake-body-piece': snakePieceBody(coordinateX(i), coordinateY(i)),
            'snake-body-head': snakeHead(coordinateX(i), coordinateY(i)),
          }"
        ></div>
      </template>
    </div>
    <div class="arrow-box">
      <button
        class="arrow-box__item arrow-box-left"
        @click="moveSnake('ArrowLeft')"
      >
        >
      </button>
      <button
        class="arrow-box__item arrow-box-up"
        @click="moveSnake('ArrowUp')"
      >
        >
      </button>
      <button
        class="arrow-box__item arrow-box-down"
        @click="moveSnake('ArrowDown')"
      >
        >
      </button>
      <button
        class="arrow-box__item arrow-box-right"
        @click="moveSnake('ArrowRight')"
      >
        >
      </button>
    </div>
  </div>
</template>

<script>
import {
  updateBestResultGame,
  getBestResultGame,
} from "../localStorage/bestResultGame";

export default {
  name: "Snake",

  data: () => {
    return {
      snakePiece: [],
      foodIndex: [],
      numberCells: 100,
      direction: "ArrowRight",
      startShow: true,
      speed: 600,
      prohibitionAbruptActions: true,
      total: 0,
      winningScore: 35,
      endGameShow: false,
      winGameShow: false,
      bestResultGame: false,
      interval: null,
      widthWindow: window.innerWidth,
      levels: [
        {
          title: "Тяжелый",
          value: 200,
        },
        {
          title: "Средний",
          value: 400,
        },
        {
          title: "Лёгкий",
          value: 600,
        },
      ],
    };
  },

  methods: {
    // Создание пищи для змейки рандомно
    creatingFoodForSnake() {
      let randomX = Math.floor(Math.random() * 10 + 1);
      let randomY = Math.floor(Math.random() * 10 + 1);

      let bol = this.snakePiece.every((item) => {
        let result = false;
        if (item[0] === randomX && item[1] === randomY) {
          result = false;
        } else {
          result = true;
        }
        return result;
      });

      if (bol) {
        this.foodIndex = [randomX, randomY];
      } else {
        this.creatingFoodForSnake();
      }
    },

    // Движение змейки
    changePosition() {
      this.interval = setInterval(() => {
        let headValueX = this.snakePiece[this.snakePiece.length - 1][0];
        let headValueY = this.snakePiece[this.snakePiece.length - 1][1];

        if (this.direction === "ArrowRight") {
          this.snakePiece.push([headValueX + 1, headValueY]);
        }

        if (this.direction === "ArrowLeft") {
          this.snakePiece.push([headValueX - 1, headValueY]);
        }

        if (this.direction === "ArrowUp") {
          this.snakePiece.push([headValueX, headValueY - 1]);
        }

        if (this.direction === "ArrowDown") {
          this.snakePiece.push([headValueX, headValueY + 1]);
        }

        if (this.snakePiece[this.snakePiece.length - 1][0] > 10) {
          this.snakePiece[this.snakePiece.length - 1][0] = 1;
        }

        if (this.snakePiece[this.snakePiece.length - 1][1] > 10) {
          this.snakePiece[this.snakePiece.length - 1][1] = 1;
        }

        if (this.snakePiece[this.snakePiece.length - 1][0] < 1) {
          this.snakePiece[this.snakePiece.length - 1][0] = 10;
        }

        if (this.snakePiece[this.snakePiece.length - 1][1] < 1) {
          this.snakePiece[this.snakePiece.length - 1][1] = 10;
        }

        if (!this.catchingFood()) {
          this.snakePiece.shift();
        }

        this.total = this.snakePiece.length - 3;
        this.prohibitionAbruptActions = true;
        this.endGame();
        this.winGame();
      }, this.speed);
    },

    // Смена движения
    moveSnake(value = "ArrowRight") {
      if (this.prohibitionAbruptActions) {
        let bol = true;

        if (this.direction === "ArrowRight" && value === "ArrowLeft") {
          this.direction === "ArrowRight";
          bol = false;
        }

        if (this.direction === "ArrowLeft" && value === "ArrowRight") {
          this.direction === "ArrowLeft";
          bol = false;
        }

        if (this.direction === "ArrowUp" && value === "ArrowDown") {
          this.direction === "ArrowUp";
          bol = false;
        }

        if (this.direction === "ArrowDown" && value === "ArrowUp") {
          this.direction === "ArrowDown";
          bol = false;
        }

        if (bol) {
          this.direction = value;
        }

        this.prohibitionAbruptActions = false;
      }
    },

    // Определение головы змейки
    snakeHead(x, y) {
      if (this.snakePiece.length) {
        let bol = false;

        if (
          this.snakePiece[this.snakePiece.length - 1][0] === x &&
          this.snakePiece[this.snakePiece.length - 1][1] === y
        ) {
          bol = true;
        }

        return bol;
      } else {
        return false;
      }
    },

    // Определение туловища змейки без головы
    snakePieceBody(x, y) {
      if (this.snakePiece.length) {
        let snakePieceWithoutLastElement = this.snakePiece.slice(0, -1);
        let bol = snakePieceWithoutLastElement.some((item) => {
          return item[0] === x && item[1] === y;
        });

        return bol;
      } else {
        return false;
      }
    },

    // Определение всего туловища змейки
    snakeBody(x, y) {
      let bol = this.snakePiece.some((item) => {
        return item[0] === x && item[1] === y;
      });

      return bol;
    },

    // Координата X для сетки
    coordinateX(index) {
      let x = index;

      if (index % 10) {
        x = index % 10;
      } else {
        x = 0;
      }
      return x + 1;
    },

    // Координата Y для сетки
    coordinateY(index) {
      return Math.floor(index / 10) + 1;
    },

    // Проверка поймана ли пища змейкой
    catchingFood() {
      let bol =
        this.snakePiece[this.snakePiece.length - 1][0] === this.foodIndex[0] &&
        this.snakePiece[this.snakePiece.length - 1][1] === this.foodIndex[1];

      if (bol) {
        this.creatingFoodForSnake();

        return bol;
      }

      return false;
    },

    // Начало игры
    startGame() {
      this.startGameInfo = true;

      this.startShow = false;
      this.endGameShow = false;
      this.changePosition();

      let snakeIndexX = Math.floor(Math.random() * 4 + 5);
      let snakeIndexY = Math.floor(Math.random() * 10 + 1);

      for (let i = 0; i < 3; i++) {
        this.snakePiece.push([snakeIndexX - 4 + i, snakeIndexY]);
      }

      this.creatingFoodForSnake();
    },

    // Проигрыш в игре
    endGame() {
      let bol = false;
      for (let i = 0; i < this.snakePiece.length - 1; i++) {
        if (
          this.snakePiece[this.snakePiece.length - 1][0] ===
            this.snakePiece[i][0] &&
          this.snakePiece[this.snakePiece.length - 1][1] ===
            this.snakePiece[i][1]
        ) {
          bol = true;
        }
      }
      if (bol) {
        clearInterval(this.interval);
        this.endGameShow = true;
        this.snakePiece = [];
        this.foodIndex = [];
        this.direction = "ArrowRight";
      }

      updateBestResultGame(this.total);
      this.bestResultGame = getBestResultGame();
    },

    // Победа в игре
    winGame() {
      if (this.total >= this.winningScore) {
        clearInterval(this.interval);
        this.winGameShow = true;
        this.snakePiece = [];
        this.foodIndex = [];
        this.direction = "ArrowRight";
      }

      updateBestResultGame(this.total);
      this.bestResultGame = getBestResultGame();
    },
  },

  mounted() {
    let vue = this;

    // Привязка движения змейки к стрелкам клавиатуры
    document.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") {
        vue.moveSnake("ArrowRight");
      }
      if (event.key === "ArrowLeft") {
        vue.moveSnake("ArrowLeft");
      }
      if (event.key === "ArrowUp") {
        vue.moveSnake("ArrowUp");
      }
      if (event.key === "ArrowDown") {
        vue.moveSnake("ArrowDown");
      }
    });

    this.bestResultGame = getBestResultGame();
  },
};
</script>

<style scoped lang="scss">
.snake {
  // === vars ===
  --color-1: #f6f9f8;
  --color-2: #aaacaa;
  --color-3: #e18062;
  --color-4: #bd4057;
  --color-5: #2a2740;

  position: relative;
  height: calc(100vh - 30px);
  width: 100vw;
  padding: 15px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: var(--color-5);

  &-win {
    position: absolute;
    top: 50%;
    z-index: 2;
    transform: translateY(-50%);
    left: 0;
    right: 0;
    margin: 0 auto;
    padding: 30px;
    border-radius: 10px;
    border: 0.5px solid #f6f9f8;
    width: 40%;
    min-width: 200px;
    color: var(--color-1);
    font-size: 25px;
    font-weight: 500;
    background: var(--color-3);

    &__title {
      text-transform: uppercase;
      font-weight: bold;
      margin-bottom: 20px;
    }

    &__text {
      margin-bottom: 20px;
      font-weight: bold;
    }
  }

  .best-result-game {
    margin-bottom: 30px;
    color: #00dd00;

    &__total {
      font-size: 30px;
      font-weight: bold;
    }
  }

  .start-game {
    position: absolute;
    top: 50%;
    z-index: 2;
    transform: translateY(-50%);
    left: 0;
    right: 0;
    margin: 0 auto;
    padding: 30px;
    border-radius: 10px;
    border: 0.5px solid #f6f9f8;
    width: 60%;
    min-width: 200px;
    color: var(--color-1);
    font-size: 25px;
    font-weight: 500;
    background: var(--color-5);

    &__title {
      margin-bottom: 30px;
    }

    &-info {
      &__title {
        margin-bottom: 20px;
        text-transform: uppercase;
      }

      &__img {
        display: block;
        max-width: 150px;
        width: 100%;
        margin: 0 auto;
      }
    }
  }

  .form {
    margin-bottom: 40px;

    &__input {
      display: none;
    }

    label {
      display: block;
    }

    &__item {
      margin-bottom: 10px;
    }

    &__title {
      cursor: pointer;
      display: block;
      text-align: center;
      font-weight: bold;
      transition: 0.2s linear;

      &.active {
        color: var(--color-3);
      }
    }
  }

  .btn-start {
    margin: 30px auto 0;
    padding: 15px 45px;
    background: var(--color-4);
    color: var(--color-1);
    font-weight: 600;
    border-radius: 10px;
    border: 0.5px solid #f6f9f8;
    cursor: pointer;
    transition: 0.2s linear;

    &:hover {
      background: var(--color-3);
    }
  }

  .restart-btn {
    margin: 0 auto;
    padding: 15px 45px;
    background: var(--color-4);
    color: var(--color-1);
    font-weight: 600;
    font-size: 16px;
    border-radius: 10px;
    border: 0.5px solid #f6f9f8;
    cursor: pointer;
    transition: 0.2s linear;

    &:hover {
      background: var(--color-3);
    }
  }

  .arrow-box {
    position: relative;
    margin-top: 40px;
    display: none;
    width: 300px;
    height: 170px;

    &__item {
      position: absolute;
      width: 70px;
      height: 70px;
      border-radius: 10px;
      background: var(--color-3);
      font-size: 50px;
      font-weight: bold;
      border: none;
      cursor: pointer;
      transition: background 0.1s linear;

      &:active {
        background: var(--color-4);
      }
    }

    &-right,
    &-left {
      top: 50%;
      transform: translateY(-50%);
    }

    &-right {
      right: 0;
    }

    &-left {
      left: 0;
      transform: translateY(-50%) rotate(180deg);
    }

    &-down,
    &-up {
      margin: 0 auto;
      left: 0;
      right: 0;
    }

    &-down {
      bottom: 0;
      transform: rotate(90deg);
    }

    &-up {
      top: 0;
      transform: rotate(-90deg);
    }
  }

  &-total-points {
    position: absolute;
    top: 50%;
    z-index: 2;
    transform: translateY(-50%);
    left: 0;
    right: 0;
    margin: 0 auto;
    padding: 40px 45px;
    border-radius: 10px;
    border: 0.5px solid #f6f9f8;
    width: 40%;
    min-width: 200px;
    color: var(--color-1);
    font-size: 25px;
    font-weight: 500;
    background: var(--color-5);

    &__msg {
      font-weight: bold;
    }

    &__title {
      margin-right: 20px;
    }

    &__item {
      margin-bottom: 30px;
    }
  }

  &-field {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    width: 45vw;
    max-width: 95vw;
    height: 45vw;
    max-height: 95vh;
    background: var(--color-5);
    border: 2px solid var(--color-1);
    border-radius: 20px;

    &::before {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      width: 25%;
      height: 25%;
      margin: 0 auto;
      transform: translateY(-50%);
      content: "";
      background: url(../assets/snake-img.svg) no-repeat;
      background-size: cover;
      opacity: 0.5;
    }

    &__item {
      position: relative;
      width: 10%;
      height: 10%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: 1px;

      &::before {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 20px;
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

@media (max-width: 1700px) {
  .snake {
    &-field {
      width: 50vw;
      height: 50vw;
    }
  }
}

@media (max-width: 1350px) {
  .snake {
    &-field {
      width: 60vw;
      height: 60vw;
    }
  }
}

@media (max-width: 1024px) {
  .snake {
    &-field {
      width: 65vw;
      height: 65vw;
      border-radius: 10px;

      &__item {
        &::before {
          border-radius: 10px;
        }
      }
    }

    .arrow-box {
      display: block;
    }
  }
}

@media (max-width: 650px) {
  .snake {
    &-field {
      width: 95vw;
      height: 95vw;
    }
  }
}
</style>
