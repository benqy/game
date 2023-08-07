import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { sayHi } from '@benqy/ecs'

sayHi('Benqy')
createApp(App).mount('#app')
