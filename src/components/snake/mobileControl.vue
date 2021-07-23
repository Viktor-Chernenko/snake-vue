<template>
  <div class="arrow-box">
    <button
      class="arrow-box__item arrow-box-left"
      @click="logic.moveSnake('ArrowLeft')"
    >
      >
    </button>
    <button
      class="arrow-box__item arrow-box-up"
      @click="logic.moveSnake('ArrowUp')"
    >
      >
    </button>
    <button
      class="arrow-box__item arrow-box-down"
      @click="logic.moveSnake('ArrowDown')"
    >
      >
    </button>
    <button
      class="arrow-box__item arrow-box-right"
      @click="logic.moveSnake('ArrowRight')"
    >
      >
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
};
</script>

<style lang="scss" scoped>
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

@media (max-width: 1024px) {
  .arrow-box {
    display: block;
  }
}
</style>
