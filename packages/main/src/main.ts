import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
createApp(App).mount('#app')
import { Game } from "@benqy/basic-sample"

const game = new Game('game')
game.start()
