<template>
  <q-layout view="hHh Lpr lff" class="room-layout" ref="layout">
    <q-header elevated class="bg-white header" v-if="!fullScreen && false">
      <q-toolbar class="row">
        <q-toolbar-title class="col text-primary text-h5" >
          <span>meetnav</span>
        </q-toolbar-title>
        <div class="col row justify-end q-gutter-md" v-if="user">
          <NekoRooms class="col q-ma-none" />
          <q-avatar class="btn">
            <img :src="user.avatar" />
          </q-avatar>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    <component :is="'style'" v-html="style"></component>
  </q-layout>
</template>

<script>
import NekoRooms from '../components/NekoRooms'

export default {
  components: {
    NekoRooms
  },
  data () {
    return {
      selectedLanguage: 'English',
      leave: false,
      openChat: false,
      userMini: false,
      rating: 0
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
    },
    fullScreen () {
      return this.$storex.room.fullScreen
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
      this.$storex.room.closeLiveRoom(close)
      this.justLeave()
    }
  }
}
</script>
<style lang="sass">
</style>
