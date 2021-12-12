import Vue from 'vue'
import App from './App.vue'
import store from '@/store'
import Notifications from 'vue-notification'
import velocity from 'velocity-animate'
import JsonCSV from 'vue-json-csv'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'windi.css'
import '@/styles/index.css'

Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.component('downloadCsv', JsonCSV)
Vue.use(Notifications, { velocity })

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app')
