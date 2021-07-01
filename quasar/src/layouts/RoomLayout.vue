<template>
  <q-layout view="hHh Lpr lff" class="room-layout" ref="layout">
    <GuestLogin v-if="!user" />
    <q-header
    elevated class="bg-white header">
      <q-toolbar class="row">
        <q-toolbar-title class="col text-primary text-h5" >
          <span>meetnav</span>
        </q-toolbar-title>
        <div class="text-accent text-h3">
          {{ roomId }}
        </div>
        <div class="col row justify-end">
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer
      side="right"
      v-model="openChat"
      bordered
      :breakpoint="500"
    >
      <q-scroll-area class="fit chat">
        <div class="q-pa-sm fit">
          <NekoChat />
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <component :is="'style'" v-html="style"></component>
  </q-layout>
</template>

<script>
import GuestLogin from '../components/GuestLogin'
import NekoChat from '../components/neko/NekoChat'

export default {
  components: {
    GuestLogin,
    NekoChat
  },
  data () {
    return {
      selectedLanguage: 'English',
      leave: false,
      openChat: false,
      userMini: false
    }
  },
  computed: {
    isAdmin () {
      return this.$storex.user.user.role.description === 'administrator'
    },
    isDebug () {
      return this.$route.query.debug
    },
    user () {
      return this.$storex.user.user
    },
    neko () {
      return this.$storex.room.nekoConnected
    },
    anyUser () {
      return Object.keys(this.$storex.room.streams).length !== 0
    },
    permissionState () {
      return this.$store.permissionState
    },
    debugUserStreams () {
      let debug = this.isDebug
      const streams = this.$storex.room.streams
      const u = streams[Object.keys(streams)[0]][0]
      const res = {}
      while (debug--) {
        const stream = u.stream.clone()
        const mediaElement = document.createElement('video')
        mediaElement.srcObject = stream
        res['u' + debug] = [{
          ...u,
          mediaElement,
          stream
        }]
      }
      return res
    },
    style () {
      const { room } = this.$storex.room
      return room ? room.style : ''
    },
    messages () {
      return this.$storex.room.messages
    },
    roomId () {
      return this.$route.path.split('/').reverse()[0]
    }
  },
  watch: {
    messages () {
    }
  },
  methods: {
    changeLanguage (lang) {
      this.$i18n.locale = lang
      this.selectedLanguage = this.$t('name')
    },
    logout () {
      this.$store.commit('user/SET_USER', {})
      location.reload()
    },
    onMessage (msg) {
      this.$storex.room.neko.chat.sendMessage(msg)
    },
    justLeave () {
      this.$router.push('/')
    },
    closeRoom (close) {
      this.$storex.room.closeRoom(close)
      this.justLeave()
    }
  }
}
</script>
<style lang="sass">
.room-layout
  .q-scrollarea
    .absolute.full-width
      height: 100% !important

  .neko-chat
    .neko-emoji
      width: 100% !important
    .message
      margin-top: 3px
      background-color: #ffffffe0 !important
      border-radius: 5px !important

  .emotes
    > ul
      padding-inline-start: 0px
      > li
        display: none
        &:last-child
          display: inherit
    ul.context
      background-color: white !important
      li
        display: inherit
  .q-drawer
    background: transparent

@import url(/layouts/standard.css)
</style>
