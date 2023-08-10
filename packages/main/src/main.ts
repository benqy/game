import { createApp } from 'vue'
import './assets/main.css'
import { Hapi } from '@benqy/hapi'
import App from './App.vue'
createApp(App).mount('#app')
// import { BasicGame } from "@benqy/basic-sample"

// const game = new BasicGame('game')
// game.start()

const hapi = new Hapi({
  view: document.querySelector('#game')!,
  assetDir: 'http://localhost:5173/src/assets/img/',
})
hapi.start()
