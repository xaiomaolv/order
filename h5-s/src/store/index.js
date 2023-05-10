import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import sys from './modules/sys'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    sys,
  },
  getters
})

export default store
