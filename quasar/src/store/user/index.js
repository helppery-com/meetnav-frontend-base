import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import api from '../api'
import { storex } from '../index'
import { Cookies } from 'quasar'

export const namespaced = true

// Module state
export const state = () => ({
  user: null,
  jwt: null
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
  isGuest: state => state.user && state.user.license.max_daily === 0,
  email: state => storex.user.isGuest ? state.user.guestEmail : state.user.email,
  id: state => state.user ? state.user.id : null,
  atname: state => `@${state.user.username}`
})

// Change state
export const mutations = mutationTree(state, {
  async setUser (state, { user, jwt }) {
    state.user = user
    state.jwt = jwt
    api.jwt = jwt
    if (storex.user.isGuest) {
      user = null
      jwt = null
    }
    Cookies.set('meetnav_session_jwt', jwt, { path: '/' })
    Cookies.set('meetnav_session_user', user, { path: '/' })
    try {
      if (user) {
        storex.live.connect()
      } else {
        storex.live.disconnect()
      }
    } catch (ex) {
      console.error(ex)
    }
    storex.room.loadUserRooms()
  },
  async changeLanguage (state, lang) {
    if (state.user) {
      state.user = await api.changeLanguage(lang)
      Cookies.set('meetnav_session_user', state.user)
    }
  }
})

// Module logic
export const actions = actionTree(
  { state, getters, mutations },
  {
    init () {
      api.jwt = Cookies.get('meetnav_session_jwt')
      api.user = Cookies.get('meetnav_session_user')
      storex.user.setUser({ jwt: api.jwt, user: api.user })
    },
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
    async forgotPassword ({ state }, email) {
      await api.forgotPassword(email)
    },
    async resetPassword ({ state }, { code, password }) {
      await api.resetPassword(code, password)
    },
    logout () {
      storex.user.setUser({ user: null, jwt: null })
    },
    async register ({ state }, { username, email, password }) {
      await api.register(username, email, password)
    },
    async registerGuest ({ state }, email) {
      await api.registerGuest(email)
    },
    async updateProfile ({ state }) {
      const { user, jwt } = state
      const userData = await api.updateProfile(user)
      storex.user.setUser({ user: userData.data, jwt })
    },
    async confirm ({ state }, code) {
      await api.confirm(code)
    }
  }
)
