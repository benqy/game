import { createApp } from 'vue'
import './style.css'
import {Hapi} from '@benqy/hapi'
import App from './App.vue'
createApp(App).mount('#app')
// import { BasicGame } from "@benqy/basic-sample"

// const game = new BasicGame('game')
// game.start()

const hapi = new Hapi({view:document.querySelector('#game')!})
hapi.start()

