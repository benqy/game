<script setup lang="ts">
import { ref } from 'vue'
import BasicSample from './pages/BasicSample.vue'
import MainGame from './pages/MainGame.vue'
import QuadTree from './pages/QuadTree.vue'
// type AppState = {
//   page: string
// }
let state = ref({ page: '3' })

const changePage = (page: string) => {
  state.value.page = page
  console.log(page, 4)
}
</script>

<template>
  <div class="content">
    <div class="tool" v-if="state.page === '0'">
      <button @click="changePage('1')">基本示例</button>
      <button @click="changePage('2')">完整游戏示例</button>
      <button @click="changePage('3')">四叉树碰撞检测</button>
    </div>
    <BasicSample v-if="state.page === '1'" />
    <MainGame v-if="state.page === '2'" />
    <QuadTree v-if="state.page === '3'" />
  </div>
</template>

<style scoped></style>
