import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import application from './application/index'
import user from './user'
export default function () {
  const store = new Vuex.Store({
    modules: {
      application,
      user
    }
  })
  return store
}
