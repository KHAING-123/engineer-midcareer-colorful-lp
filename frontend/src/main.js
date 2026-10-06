import { createApp } from 'vue'
import App from './App.vue'
import reveal from './directives/reveal.js'

import './assets/styles/variables.css'
import './assets/styles/base.css'
import './assets/styles/lp.css'
import './assets/styles/ambient.css'
import './assets/styles/reveal.css'
import './assets/styles/heading-reveal.css'
import './assets/styles/premium-icon.css'

createApp(App).use(reveal).mount('#app')
