<template>
  <div class="game-win" v-if="winGameShow">
    <div class="game-win__title">Поздравляю</div>
    <div class="game-win__text">Вы выйграли +1 к карме</div>
    <button class="restart-btn" @click.prevent="startOver">
      НАЧАТЬ ЗАНОВО
    </button>
  </div>
</template>

<script>
export default {
  name: "winGame",

  props: {
    winGameShow: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    startOver() {
      this.$emit("startOver");
    },
  },
};
</script>

<style lang="scss" scoped>
.game-win {
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
