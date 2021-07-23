<template>
  <div class="snake">
    <start-game :startShow="startShow" @startGame="logic.startGame()" />

    <end-game :endGameShow="endGameShow" @clickRestart="showLevelSelection" />

    <win-game :winGameShow="winGameShow" @clickRestart="showLevelSelection" />

    <div
      class="snake-grid"
      :style="{ width: widthGrid + 'px' }"
      v-if="gridShow"
    >
      <template v-for="(item, i) in createGrid">
        <div
          :key="i"
          :data-X="item.x"
          :data-Y="item.y"
          class="snake-grid__item"
          :class="{
            food: logic.isPositionOfFoodForSnake(item.x, item.y),
            'snake-body__item': logic.isPositionOfSnakeBody(item.x, item.y),
            'snake-body-piece': logic.isPositionOfSnakePieceBody(
              item.x,
              item.y
            ),
            'snake-body-head': logic.isPositionOfSnakeHead(item.x, item.y),
          }"
          :style="{ width: gridItemSize + 'px', height: gridItemSize + 'px' }"
        ></div>
      </template>
      <div class="logo">
        <img src="../../assets/snake-img.svg" alt="logo" />
      </div>
    </div>

    <mobile-control />
  </div>
</template>

<script>
import startGame from "./startGame.vue";
import endGame from "./endGame.vue";
import winGame from "./winGame.vue";
import mobileControl from "./mobileControl.vue";
import logic from "./logic.js";

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
      logic: logic,

      winGameShow: false,
      endGameShow: false,
      startShow: true,
      gridShow: false,

      grid: { x: 10, y: 10 },
      startSnakeSize: 4,
      speed: 600,

      defaultGridItemSize: 80,
      winningScore: 15,
    };
  },

  methods: {
    // Переход к выбору уровня
    showLevelSelection() {
      this.endGameShow = false;
      this.winGameShow = false;

      this.startShow = true;
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
    widthGrid() {
      const { x } = this.grid;

      return this.gridItemSize * x;
    },
  },

  watch: {
    "logic.snakePiece"(newValue) {
      if (!newValue.length) return;

      logic.changingPositionIfItOutsideGrid(newValue);
      logic.endGameIfHeadIntersectsWithBody();
      logic.checkingWhetherUserHasWonGame();

      logic.isCatchingFood();
    },
  },

  mounted() {
    logic.setComponent(this);
    logic.addBestResult();
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

  &-grid {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    background: var(--color-5);
    border: 2px solid var(--color-1);
    border-radius: 1%;

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
