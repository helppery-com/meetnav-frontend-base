import Vue from 'vue'
import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { storex } from '../index'
import api from '../api'
import neko from 'neko-client/dist/neko-lib.umd'
import io from 'socket.io-client'
import RTCNavroom from '../../assets/RTCMultiConnectionClient'
import { i18n } from '../../boot/i18n'

window.io = io
Vue.prototype.$accessor = neko
window.$neko = neko

// Module state
export const state = () => ({
  rtcConnecting: false,
  rtcConnected: false,
  nekoConnected: false,
  rtc: null,
  room: null,
  streams: {},
  pointers: {},
  paused: false,
  muted: false,
  controlMode: 'free',
  userStream: null,
  hasControl: false,
  host: null,
  autoReconnect: null
})

// Computed state
export const getters = getterTree(state, {
  roomId: state => state.room ? state.room.roomId : null,
  password: state => state.room ? state.room.password : null,
  cameras: state => state.rtcConnected ? state.rtc.cameras : [],
  messages: state => state.rtcConnected ? neko.chat.history : [],
  connected: state => state.rtcConnected && state.nekoConnected,
  uploadUrl: () => api.uploadUrl,
  uploadHeaders: () => api.headers,
  mediaUrl: () => api.mediaUrl,
  nekoTemplates: () => api.nekotemplates(),
  neko: () => neko
})

// Change state
export const mutations = mutationTree(state, {
  setRoom (state, room) {
    state.room = room
  },
  addStream (state, stream) {
    const ss = state.streams[stream.userid] || []
    ss.push(stream)
    state.streams = {
      ...state.streams,
      [stream.userid]: ss
    }
    if (stream.extra.id === storex.user.user.id) {
      state.userStream = stream
    }
  },
  removeStream (state, event) {
    delete state.streams[event.userid]
    state.streams = {
      ...state.streams
    }
    if (event.extra.id === storex.user.user.id) {
      state.userStream = null
    }
  },
  setRTCConnecting (state) {
    state.rtcConnecting = true
  },
  setRTC (state, rtc) {
    state.rtc = rtc
    state.rtcConnected = !!rtc
    state.rtcConnecting = false
  },
  setNekoConnected (state, connected) {
    state.nekoConnected = connected
    if (connected) {
      state.autoReconnect = setInterval(() => storex.room.reconnect(), 5000)
    }
  },
  updateHost (state) {
    setTimeout(() => {
      if (neko.remote.host) {
        state.host = {
          ...neko.remote.host,
          displayName: neko.remote.host.displayname
        }
      } else {
        state.host = null
      }
    }, 1000)
  },
  reset (state) {
    clearInterval(state.autoReconnect)
    state.autoReconnect = null
    state.rtcConnecting = false
    state.rtcConnected = false
    state.nekoConnected = false
    state.rtc = null
    state.room = null
    state.streams = {}
  },
  setPaused (state, paused) {
    state.paused = paused
  },
  setMuted (state, muted) {
    state.muted = muted
  },
  setControl (state, value) {
    state.hasControl = value
  },
  setRoomStyle (state, style) {
    state.room.style = style
  }
})

async function connectRTC (roomId) {
  const rtc = new RTCNavroom(storex.user.user)
  rtc.onUserConnected = storex.room.addStream.bind(this)
  rtc.onUserDisconnected = storex.room.removeStream.bind(storex)
  rtc.onMessage = storex.room.onRoomMessage.bind(storex)
  rtc.connect(roomId)
  return rtc
}

// Module logic
export const actions = actionTree(
  { state, getters, mutations },
  {
    async openOrJoin ({ state }, { template, roomId }) {
      const isNew = !roomId
      let room = null
      if (isNew) {
        room = await api.createRoom(template)
      } else {
        room = await api.joinRoom(roomId)
      }
      if (room) {
        await storex.room.connect(room)
        const rtc = await connectRTC(room.roomId)
        neko.settings.setScroll(5)
        storex.room.setRTC(rtc)
        storex.room.setRoom(room)
        storex.room.setNekoConnected(true)
      } else {
        storex.room.leave()
        throw new Error('Could not open room')
      }
    },
    async connect ({ state }, { wurl, password }) {
      const user = storex.user.user
      window.$client.initWithURL(new Vue({
        i18n
      }), wurl)
      await neko.login({ displayname: user.username, password })
      const click = () => {
        neko.setActive()
        if (neko.settings.autoplay && neko.video.playing) {
          neko.video.setMuted(false)
        }
        window.removeEventListener('click', click, false)
      }
      window.addEventListener('click', click, false)
      // Wait for neko to confirm member connection
      return new Promise((resolve, reject) => {
        let attempts = 10
        const check = () => setTimeout(() => {
          if (neko.user.member) {
            resolve()
          } else {
            if (--attempts) {
              check()
            } else {
              reject()
            }
          }
        }, 1000)
        check()
      })
    },
    reconnect ({ state }) {
      if (state.nekoConnected && !neko.video.playing) {
        try {
          storex.room.connect(state.room)
        } catch (ex) {
          console.error(ex)
        }
      }
    },
    async leave ({ state }) {
      if (!state.rtcConnected) {
        return
      }
      await state.rtc.leave()
      try {
        await neko.logout()
      } catch {
        // BUG: Issue with Swal plugin
      }
      storex.room.reset()
    },
    async closeRoom ({ state }) {
      if (!state.rtcConnected) {
        return
      }
      await api.closeRoom(state.rtc.roomId)
      storex.room.leave()
    },
    sendRoomMessage ({ state }, message) {
      state.rtc.send({
        ...message,
        _ts: new Date().getTime()
      })
    },
    onRoomMessage ({ state }, message) {
      if (message.event === 'mousemove') {
        if (state.pointers[message.id]) {
          clearTimeout(state.pointers[message.id].tout)
        }
        state.pointers = {
          ...state.pointers,
          [message.id]: {
            ...message,
            tout: setTimeout(() => storex.room.removePointer(message.id), 3000)
          }
        }
      }
      if (message.event === 'controlreleaserequest') {
        if (neko.remote.hosting && state.controlMode === 'free') {
          storex.room.releaseControls()
        }
      }
      if (message.event === 'updatehost') {
        storex.room.updateHost()
      }
      if (message.event.startsWith('touch')) {
        console.log(message)
      }
    },
    removePointer ({ state }, id) {
      delete state.pointers[id]
      state.pointers = {
        ...state.pointers
      }
    },
    toggleVideo ({ state }) {
      state.rtc.toggleVideo()
      storex.room.setPaused(state.rtc.paused)
    },
    toggleAudio ({ state }) {
      state.rtc.toggleAudio()
      storex.room.setMuted(state.rtc.muted)
    },
    requestControls ({ state }) {
      if (neko.remote.hosting) {
        return
      }
      if (state.controlMode === 'free' && neko.remote.hosted) {
        storex.room.sendRoomMessage({
          event: 'controlreleaserequest'
        })
        let attempts = 10
        const waitControl = () => {
          if (attempts-- && neko.remote.hosted) {
            setTimeout(() => waitControl(), 500)
          } else {
            neko.remote.request()
          }
        }
        waitControl()
      } else {
        neko.remote.request()
      }
      storex.room.setControl(true)
      neko.settings.setKeyboardLayout(storex.user.lang)
      neko.remote.changeKeyboard()
      storex.room.updateHost()
      storex.room.sendRoomMessage({
        event: 'updatehost'
      })
    },
    releaseControls ({ state }) {
      if (!neko.remote.hosting) {
        return
      }
      neko.remote.release()
      storex.room.setControl(false)
    }
  }
)
