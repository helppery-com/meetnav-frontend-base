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
  lang: state => {
    if (state.user && state.user.lang) {
      return state.user.lang
    }
    return navigator.language
  },
  displayName: state => state.user ? state.user.displayName || state.user.username : '',
  isGuest: state => state.user && state.user.license.max_daily === 0
})

// Change state
export const mutations = mutationTree(state, {
  setUser (state, { user, jwt }) {
    state.user = user
    state.jwt = jwt
    api.jwt = jwt
    if (storex.user.isGuest) {
      user = null
      jwt = null
    }
    Cookies.set('session_jwt', jwt, { path: '/' })
    Cookies.set('session_user', user, { path: '/' })
  },
  async changeLanguage (state, lang) {
    if (state.user) {
      state.user = await api.changeLanguage(lang)
      Cookies.set('session_user', state.user)
    }
  }
})

// Module logic
export const actions = actionTree(
  { state, getters, mutations },
  {
    async login ({ state }, { username, password, displayName, email, guestEmail }) {
      const userLogged = await api.login(username, password)
      const { user } = userLogged
      if (guestEmail) {
        user.guestEmail = guestEmail
      }
      if (displayName) {
        user.displayName = displayName
      }
      if (email) {
        user.email = email
      }
      storex.user.setUser(userLogged)
    },
    logout () {
      storex.user.setUser({ user: null, jwt: null })
    },
    async register ({ state }, { username, email, password }) {
      await api.register(username, email, password)
    },
    async registerGuest ({ state }, email) {
      await api.registerGuest(email)
    }
  }
)
