import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import 'normalize.css'
import './styles/main.scss'
import Loader from './components/app/Loader'
import './registerServiceWorker'

createApp(App)
  .use(store)
  .component('Loader', Loader)
  .mount('#app')
