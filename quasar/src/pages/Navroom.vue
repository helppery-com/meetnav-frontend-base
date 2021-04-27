<template>
  <q-page class="navroom-page row">
    <div class="q-pa-xs users col-3 column justify-start" v-if="anyUser">
      <div :class="userVideoClass" v-for="(stream, userid, ix) in users" :key="ix">
        <UserVideo
          :style="{ 'max-height': userVideoHeight() }"
          :stream="stream"
          :showUserInfo="true"
        />
      </div>
    </div>
    <div class="col q-pa-xs">
      <NekoVideo class="rounded-borders" @connected="ref => nekoVideoRef = ref" v-if="connected" />
    </div>
    <q-dialog v-model="welcome" transition-show="scale" transition-hide="scale">
      <q-card class="bg-primary text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">
            {{ $t('Room is begin created') }}
          </div>
        </q-card-section>
        <q-card-section>
          <Commercial @end="lnk => commercialLink = lnk" />
        </q-card-section>
        <q-card-section class="bg-white">
          <a href="" target="_blank">
            {{ $t('By joining this room you accept terms and conditions.') }}
          </a>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal" v-if="connected && commercialLink">
          <q-btn outline color="primary" :label="$t('OK')" v-close-popup class="ref-navroom-ready" />
          <q-btn outline icon="fas fa-external-link-alt" color="accent" :label="$t('Visit sponsor')" @click="openCommercial" class="ref-navroom-sponsor-link" />
        </q-card-actions>
        <q-card-actions align="right" class="bg-white text-teal" v-else>
          <q-spinner-pie
            color="primary"
            size="2em"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import NekoVideo from '../components/neko/NekoVideo'
import Commercial from '../components/Commercial'
import UserVideo from '../components/UserVideo'

import '../assets/styles/vendor/_emote.scss'

export default {
  components: {
    NekoVideo,
    Commercial,
    UserVideo
  },
  data () {
    return {
      video: false,
      initRTC: false,
      nekoVideoRef: null,
      volume: 100,
      leave: false,
      welcome: false,
      rating: 0,
      commercialLink: null
    }
  },
  computed: {
    isDebug () {
      return this.$route.query.debug
    },
    connected () {
      return this.$storex.room.nekoConnected
    },
    roomId () {
      return this.$storex.room.roomId
    },
    password () {
      return this.$storex.room.password
    },
    videoWidth () {
      if (this.nekoVideoRef) {
        return this.nekoVideoRef.videoWidth + 'px'
      }
      return '100%'
    },
    userCount () {
      return Object.keys(this.users).length
    },
    userVideoClass () {
      const col = parseInt(12 / this.userCount)
      return `col-${col}`
    },
    users () {
      return this.isDebug ? this.debugUserStreams : this.$storex.room.streams
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
    anyUser () {
      return Object.keys(this.$storex.room.streams).length !== 0
    }
  },
  watch: {
    roomId (newVal) {
      if (newVal && !this.$route.params.roomId) {
        this.$router.push(`/navroom/${this.roomId}`)
      }
    },
    connected () {
      console.log('Connected')
    }
  },
  async created () {
    if (!this.$storex.user.user) {
      this.$root.$emit('login')
      this.$root.$once('user-logged', () => this.openRoom())
    } else {
      this.openRoom()
    }
  },
  methods: {
    async openRoom () {
      this.welcome = true
      const { roomId } = this.$route.params
      const { template } = this.$route.query
      await this.$storex.room.openOrJoin({ roomId, template })
    },
    openCommercial () {
      window.open(this.commercialLink, '_blank')
    },
    userVideoHeight () {
      const { minHeight } = this.$el.style
      const height = parseInt(minHeight.replace('px', ''))
      const userCount = this.userCount
      return `${parseInt(height / userCount)}px`
    }
  },
  beforeDestroy () {
    this.$storex.room.leave()
  }
}
</script>
<style lang="sass">
  body
    overflow: hidden
  .navroom-page
    .neko-video
      opacity: 0.9
    .footer
      height: 45px
    ul.video-menu.bottom,
    ul.video-menu.top
      display: none
    .player
      border-radius: 3px
    .members
      video
        border-radius: 5px
    .emotes
      max-witdh: 100%
      max-height: 100%
      overflow: hidden
      margin-right: 10px
      -webkit-box-flex: 1
      -ms-flex: 1
      -webkit-box-pack: end
      -ms-flex-pack: end
      justify-content: flex-end
      -webkit-box-align: center
      -ms-flex-align: center
      align-items: center
      display: -webkit-box
      display: -ms-flexbox
      display: flex
      ul
        list-style: none
        padding-inline-start: 0
        margin-block-end: 0
        margin-block-start: 0
</style>
