import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import application from './application/index'
import search from './search/index'
export default function () {
  const store = new Vuex.Store({
    modules: {
      application,
      search
    }
  })
  return store
}
