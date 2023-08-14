<script setup lang="ts">
import { BasicGame } from '@benqy/basic-sample'
import { onMounted } from 'vue'

// const hapi = new Hapi({
//   view: document.querySelector('#game')!,
//   assetDir: 'http://localhost:5173/src/assets/img/',
// })
// hapi.start()
onMounted(() => {
  const game = new BasicGame('game')
  game.start()
})
</script>

<template>
  <div class="game"></div>
</template>

<style scoped></style>
