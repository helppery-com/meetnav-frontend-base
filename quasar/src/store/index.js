import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import application from './application'

import search from './search'
import user from './user'

export default function () {
  const store = new Vuex.Store({
    modules: {
      application,
      user,
      search
    }
  })
  return store
}

export { store }
