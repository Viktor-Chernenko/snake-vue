<template>
  <div id="app">
    <Snake msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import Snake from "./components/snake/index.vue";

export default {
  name: "App",
  components: {
    Snake,
  },
};
</script>

<style lang="scss">
#app {
  // === vars ===
  --color-1: #f6f9f8;
  --color-2: #aaacaa;
  --color-3: #e18062;
  --color-4: #bd4057;
  --color-5: #2a2740;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
