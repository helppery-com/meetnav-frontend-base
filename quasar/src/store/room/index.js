import Vue from 'vue'
import { getterTree, mutationTree, actionTree } from 'typed-vuex'
import { storex } from '../index'
import api from '../api'
import neko from 'neko-client/dist/neko-lib.umd'
import io from 'socket.io-client'
import RTCNavroom from '../../assets/RTCMultiConnectionClient'
import { i18n } from '../../boot/i18n'

export const namespaced = true

window.io = io
Vue.prototype.$accessor = neko
window.$neko = neko

// Hack neko chat

const _sendMessage = neko.chat.sendMessage
neko.chat.sendMessage = function (...args) {
  _sendMessage.apply(neko, args)
  api.chat(storex.room.roomId, args[0])
}

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
  autoReconnect: null,
  showChat: false,
  nekoRooms: []
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
  nekoTemplates: () => api.user ? api.nekotemplates() : [],
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
  },
  toggleChat (state) {
    state.showChat = !state.showChat
  },
  setRooms (state, rooms) {
    state.nekoRooms = rooms
  }
})

async function connectRTC (roomId, incognito) {
  const rtc = new RTCNavroom({
    id: storex.user.user.id,
    username: storex.user.displayName,
    email: storex.user.email,
    avatar: storex.user.user.avatar
  })
  rtc.onUserConnected = storex.room.addStream.bind(this)
  rtc.onUserDisconnected = storex.room.removeStream.bind(storex)
  rtc.onMessage = storex.room.onRoomMessage.bind(storex)
  const settings = { withCamera: !incognito, withMic: !incognito }
  rtc.connect(roomId, settings)
  return rtc
}

// Module logic
export const actions = actionTree(
  { state, getters, mutations },
  {
    async openOrJoin ({ state }, settings) {
      if (state.showChat) {
        storex.room.toogleChat()
      }
      const { template, roomId, username, calling, email, incognito } = settings
      let room = null
      if (calling) {
        room = await api.waitRoom(storex.user.user, username, template, email)
      } else if (!roomId) {
        room = await api.createRoom(settings)
      } else {
        room = await api.joinRoom(roomId, template)
      }
      if (room) {
        const rtc = await connectRTC(room.roomId, incognito)
        storex.room.setRTC(rtc)
        await storex.room.connect(room)
        neko.settings.setScroll(5)
        storex.room.setRoom(room)
        storex.room.setNekoConnected(true)
        storex.room.initChat()
      } else {
        storex.room.leave()
        throw new Error('Could not open room')
      }
    },
    initChat ({ state }) {
      const { room } = state
      const { members } = neko.user
      const { chat } = room
      const memberIds = Object.keys(members)
      const nekoMembersMap = {}
      memberIds.forEach(k => {
        nekoMembersMap[members[k].displayname] = k
      })
      function getMemberId (message) {
        const { user, username: displayname } = message
        let id = nekoMembersMap[displayname]
        if (!id) {
          id = `fake_${user}`
          members[id] = {
            id,
            displayname,
            fake: true
          }
          nekoMembersMap[displayname] = id
        }
        return id
      }
      const messages = chat.map(c => ({
        id: getMemberId(c),
        content: c.message.content,
        created: new Date(Date.parse(c.message.created)),
        type: 'text'
      }))
      messages.forEach(m => neko.chat.addMessage(m))
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
            storex.room.sendRoomMessage({
              event: 'nekoconnected',
              nekoId: neko.user.member.id,
              userId: storex.user.user.id
            })
            neko.user.member.userid = storex.user.user.id
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
    async closeLiveRoom ({ state }, closeRemote) {
      if (!state.rtcConnected) {
        return
      }
      storex.room.leave()
      if (closeRemote) {
        await api.closeRoom(state.rtc.roomId)
        storex.room.loadUserRooms()
      }
    },
    async stopRoom ({ state }, { roomId }) {
      await api.stopRoom(roomId)
      storex.room.loadUserRooms()
    },
    async deleteRoom ({ state }, { roomId }) {
      await api.stopRoom(roomId)
      storex.room.loadUserRooms()
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
      if (message.event === 'nekoconnected') {
        const { nekoId, userId } = message
        neko.user.members[nekoId].meetnavId = userId
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
    },
    sendChatMessage ({ state }, message) {
      neko.chat.sendMessage(message)
    },
    async loadUserRooms ({ state }) {
      let rooms = []
      if (storex.user.user) {
        rooms = await api.nekoRooms()
      }
      storex.room.setRooms(rooms)
    }
  }
)
