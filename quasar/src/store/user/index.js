import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import api from '../api'
import { storex } from '../index'
import { Cookies } from 'quasar'

api.jwt = Cookies.get('session_jwt')
api.user = Cookies.get('session_user')

// Module state
export const state = () => ({
  user: api.user,
  jwt: api.jwt
})

// Computed state
export const getters = getterTree(state, {
})

// Change state
export const mutations = mutationTree(state, {
  setUser (state, { user, jwt }) {
    state.user = user
    state.jwt = jwt
    api.jwt = jwt
    Cookies.set('session_jwt', jwt)
    Cookies.set('session_user', user)
  }
})

// Module logic
export const actions = actionTree(
  { state, getters, mutations },
  {
    async login ({ state }, { username, password }) {
      const user = await api.login(username, password)
      storex.user.setUser(user)
    },
    logout () {
      storex.user.setUser({ user: null, jwt: null })
    },
    async register ({ state }, { username, email, password }) {
      await api.register(username, email, password)
    }
  }
)
