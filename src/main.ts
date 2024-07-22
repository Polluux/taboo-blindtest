import { createApp } from 'vue'
import router from '@/router';
import { createPinia } from 'pinia';
import '@/styles/main.css';
import App from './App.vue'

const store = createPinia();

createApp(App)
  .use(store)
  .use(router)
  .mount('#app')
