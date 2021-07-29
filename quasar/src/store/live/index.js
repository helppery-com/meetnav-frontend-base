import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import RTCNavroom from '../../assets/RTCMultiConnectionClient'
import { storex } from '../index'

export const namespaced = true

export const state = () => ({
  rtc: null,
  online: false
})

export const getters = getterTree(state, {
})

export const mutations = mutationTree(state, {
  setRTC (state, rtc) {
    state.rtc = rtc
  },
  setConnected (state) {
    state.online = true
  },
  setDisconnected (state) {
    state.online = false
  }
})

export const actions = actionTree(
  { state, getters, mutations },
  {
    async connect ({ state }) {
      if (parseInt('1') === 1 || storex.user.isGuest) {
        return
      }
      const user = {
        id: storex.user.user.id,
        username: storex.user.displayName,
        email: storex.user.email
      }
      const rtc = new RTCNavroom(user)
      rtc.onRoomOpened = storex.live.setConnected.bind(this)
      rtc.onMessage = storex.live.onRoomMessage.bind(storex)
      const settings = { withCamera: false, withMic: false }
      await rtc.connect(null, settings)
      storex.live.setRTC(rtc)
    },
    async disconnect ({ state }) {
      if (state.rtc) {
        await state.rtc.leave()
      }
      storex.live.setRTC(null)
      storex.live.setDisconnected()
    },
    onRoomMessage ({ state }, msg) {
      console.log('On live message', msg)
    }
  })
