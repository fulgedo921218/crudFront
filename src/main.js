import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

// Importa el CSS de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// Opcionalmente, importa el JavaScript de Bootstrap (requiere Popper.js)
import 'bootstrap';

createApp(App).mount('#app')
