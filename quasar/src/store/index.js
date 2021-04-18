
import Vue from 'vue'
import Vuex from 'vuex'
import { useAccessor } from 'typed-vuex'

Vue.use(Vuex)

import * as user from './user'
import * as room from './room'

const modules = {
  user,
  room
}

const store = new Vuex.Store({
  modules
})

export const storex = useAccessor(store, { modules })
Vue.prototype.$storex = storex
Vue.prototype.$state = storex

window.$storex = storex

export default function () {
  return store
}

export { store }
