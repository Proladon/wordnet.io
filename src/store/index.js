import Vue from 'vue'
import Vuex from 'vuex'
import layer from '@/store/modules/layer'
import network from '@/store/modules/network'
import getters from '@/store/getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {},
  mutations: {},
  modules: {
    layer,
    network,
  },
  getters,
})

export default store
