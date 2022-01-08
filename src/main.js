import Vue from 'vue'
import App from './App.vue'
import store from '@/store'
import Notifications from 'vue-notification'
import velocity from 'velocity-animate'
import JsonCSV from 'vue-json-csv'

// Element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// Vuesax
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css'
import 'material-icons/iconfont/material-icons.css';

import 'windi.css'
import '@/styles/index.css'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(Vuesax)

Vue.component('downloadCsv', JsonCSV)
Vue.use(Notifications, { velocity })

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app')
