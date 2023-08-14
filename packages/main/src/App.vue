<script setup lang="ts">
import { ref } from 'vue'
import BasicSample from './pages/BasicSample.vue'
import RPG from './pages/RPG.vue'
// type AppState = {
//   page: string
// }
let state = ref({ page: '0' })

const changePage = (page: string) => {
  state.value.page = page
  console.log(page, 4)
}
</script>

<template>
  <div class="content">
    <div class="tool" v-if="state.page === '0'">
      <button @click="changePage('1')">基本示例</button>
      <button @click="changePage('2')">RPG示例</button>
    </div>
    <BasicSample v-if="state.page === '1'" />
    <RPG v-if="state.page === '2'" />
  </div>
</template>

<style scoped></style>
