<template>
  <div class="end-game" v-if="endGameShow">
    <div class="end-game__item">
      <span class="end-game__msg">ВЫ ПРОИГРАЛИ</span>
    </div>
    <div class="end-game__item">
      <span class="end-game__title">ВАШ РЕЗУЛЬТАТ:</span>
      <span class="end-game__number"> {{ logic.total }} </span>
    </div>
    <button class="restart-btn" @click.prevent="clickRestart">
      НАЧАТЬ ЗАНОВО
    </button>
  </div>
</template>

<script>
import logic from "./logic.js";

export default {
  data: () => {
    return {
      logic: logic,
    };
  },

  props: {
    endGameShow: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    clickRestart() {
      this.$emit("clickRestart");
    },
  },
};
</script>

<style lang="scss" scoped>
.end-game {
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
  width: 30vw;
  min-width: 250px;
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
</style>
