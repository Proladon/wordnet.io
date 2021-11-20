import Vue from 'vue'
import App from './App.vue'
import store from '@/store'
import Notifications from 'vue-notification'
import velocity from 'velocity-animate'
import 'windi.css'

Vue.config.productionTip = false

Vue.use(Notifications, { velocity })

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app')
