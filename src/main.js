import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'


//cambio
// Se crea la aplicación
const app = createApp(App)

// Se instalan los plugins
app.use(router)
app.use(createPinia())

// Se monta la app
app.mount('#app')


// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router'

// createApp(App).use(router).mount('#app')
