<script setup lang="ts">
import { MainSence } from '@benqy/hapi'
import { onMounted } from 'vue'

onMounted(() => {
  const hapi = new MainSence({
    view: document.querySelector('.game')!,
    assetDir: 'http://localhost:5173/src/assets/img/',
  })
  hapi.start()
})
</script>

<template>
  <div class="game"></div>
</template>

<style scoped></style>
