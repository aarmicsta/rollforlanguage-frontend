import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { setupAuthListeners } from '@/features/auth/utils/setupAuthListeners'
import App from './App.vue'
import router from './router'

import './assets/styles/global.css'
import './assets/styles/tailwind.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

const authStore = useAuthStore(pinia)
authStore.initFromStorage()

app.use(router)

setupAuthListeners()

app.mount('#app')