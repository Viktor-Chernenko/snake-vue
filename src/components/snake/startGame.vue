<template>
  <div class="start-game" v-if="startShow">
    <div v-if="bestResultGame" class="best-result-game">
      Ваш лучший результат:
      <span class="best-result-game__total">{{ bestResultGame }}</span>
    </div>
    <div class="start-game__title">Выберите уровень сложности:</div>
    <form class="form">
      <div class="form__item" v-for="(item, index) in levels" :key="index">
        <label @click="changeLevel(item.id)"
          ><span
            class="form__title"
            :class="{
              active: item.id === selectLevel,
            }"
            >{{ item.title }}</span
          >
          <input class="form__input" type="radio" name="level" />
        </label>
      </div>
      <button class="form__btn btn-start" @click.prevent="startGame">
        НАЧАТЬ
      </button>
    </form>

    <div class="start-game-info" v-if="this.widthWindow > 1024">
      <div class="start-game-info__title">Управление:</div>
      <img
        src="../../assets/controls.png"
        alt="keyboard arrow controls"
        class="start-game-info__img"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "startGame",

  data: () => ({
    selectLevel: "easy",
    widthWindow: window.innerWidth,
  }),

  props: {
    bestResultGame: {
      type: [Number, String],
      default: 0,
    },

    startShow: {
      type: Boolean,
      default: false,
    },

    levels: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    changeLevel(id) {
      this.selectLevel = id;
      this.$emit("changeLevel", id);
    },

    startGame() {
      this.$emit("startGame");
    },
  },
};
</script>

<style lang="scss" scoped>
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
  width: 30vw;
  min-width: 250px;
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
</style>
