import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router/index.js'
import App from './App.vue'
import './assets/styles/main.scss'

const app = createApp(App)

// register pinia
app.use(createPinia())

// register router
app.use(router)

app.mount('#app')
