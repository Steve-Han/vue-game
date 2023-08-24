import {createApp} from 'vue'
import './style.css'
import {createPinia} from 'pinia'
import Message from './views/uiComponent/message/index.js'
import App from './App.vue'
import router from "./router.js"

const app = createApp(App);
const pinia = createPinia()

app.use(pinia);
app.use(router)
app.mount('#app');

app.config.globalProperties.$message = Message;

