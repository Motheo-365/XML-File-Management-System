import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import * as ui from "@/plugins/ui.js"

const app = createApp(App)

app.use(router)

app.config.globalProperties.$toat = ui.$toast
app.config.globalProperties.$confirm = ui.$confirm

app.mount('#app')