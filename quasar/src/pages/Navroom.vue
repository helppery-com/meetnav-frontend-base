<template>
  <q-page class="navroom-page column">
    <div class="col row">
      <div
        :class="['users relative-position column', `col-${userVideoCol}`]">
        <Dish
          class="col"
          :cameras="cameras"
          :colSize="userVideoCol"
          v-if="false"
        >
          <template v-slot:camera="{ camera }">
            <UserVideo
              :stream="camera"
              :showUserInfo="true"
            />
          </template>
        </Dish>
        <div class="col column" v-for="(camera, ix) in cameras" :key="ix">
          <UserVideo
              class="col"
              :stream="camera"
              :showUserInfo="true"
            />
        </div>
      </div>
      <NekoVideo :class="['col rounded-borders q-pa-md']" @connected="ref => nekoVideoRef = ref" v-if="connected" />
      <div
        :class="['users relative-position column', `col-${userVideoCol}`]"
        v-if="$storex.room.showChat"
      >
        <div class="col column relative-position">
          <q-scroll-area class="col fit chat">
            <div class="q-pa-sm fit">
              <NekoChat />
            </div>
          </q-scroll-area>
        </div>
      </div>
    </div>
    <div class="col-auto row q-pb-md bg-black">
      <VideoControls class="col-auto q-gutter-md" style="margin:auto"/>
    </div>
    <q-dialog
      v-model="welcome"
      transition-show="scale"
      transition-hide="scale"
      :persistent="!isAdmin"
      @hide="$storex.room.toggleChat()"
    >
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
import Dish from '../components/Dish'
import VideoControls from '../components/VideoControls.vue'
import NekoChat from '../components/neko/NekoChat'

import '../assets/styles/vendor/_emote.scss'

export default {
  components: {
    NekoVideo,
    Commercial,
    UserVideo,
    VideoControls,
    Dish,
    NekoChat
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
      commercialLink: null,
      userVideoCol: 2,
      myCam: null,
      guestCams: null,
      openChat: false
    }
  },
  computed: {
    myCamera () {
      const myCams = this.cameras.filter(c => c[0].extra.id === this.$storex.user.user.id)
      return myCams.length ? myCams[0] : null
    },
    guestCameras () {
      const cams = this.cameras.filter(c => c[0].extra.id !== this.$storex.user.user.id)
      return cams.length ? cams : null
    },
    cameras () {
      return Object.keys(this.users).map(k => this.users[k])
    },
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
      return !this.incognito || this.cameras.length > 1
    },
    incognito () {
      return this.$storex.room.muted && this.$storex.room.paused
    },
    isAdmin () {
      return this.$storex.user.user.role.description === 'administrator'
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
    },
    cameras () {
      this.myCam = this.myCamera
      this.guestCams = this.guestCameras
    }
  },
  async created () {
    if (!this.$storex.user.user) {
      this.$root.$once('user-logged', () => this.openRoom())
    } else {
      this.openRoom()
    }
  },
  methods: {
    async openRoom () {
      this.welcome = true
      const { roomId, username } = this.$route.params
      const calling = this.$route.path.endsWith('/call')
      await this.$storex.room.openOrJoin({ ...this.$route.query, roomId, username, calling })
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
    .dish
      .camera
        border-radius: 5px

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
</style>
