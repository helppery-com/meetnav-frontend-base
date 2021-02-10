import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import application from './application/index'
export default function () {
  const store = new Vuex.Store({
    modules: {
      application
    }
  })
  return store
}
