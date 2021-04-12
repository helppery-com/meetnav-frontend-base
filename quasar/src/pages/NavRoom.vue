<template>
  <q-page class="navroom-page column">
    <div class="col row">
      <div class="col-2 members column q-px-xs q-pt-xs" v-if="$storex.room.rtcConnected">
        <VideoControls class="col-auto" @leave="leave = true" />
        <UserVideo
          :stream="stream" v-for="(stream, userid, ix) in users"
          :key="ix"
          :showUserInfo="true"
          class="col-auto"/>
      </div>
      <div class="col q-py-xs q-pr-xs">
        <NekoVideo class="bg-dark rounded-borders" @connected="ref => nekoVideoRef = ref" v-if="connected" />
      </div>
    </div>
    <q-dialog v-model="welcome" persistent transition-show="scale" transition-hide="scale">
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
    <q-dialog v-model="leave" transition-show="scale" transition-hide="scale">
      <q-card class="bg-primary text-white" style="width: 600px">
        <q-card-section>
          <div class="text-h6">
            {{ $t('Leave room') }}
          </div>
        </q-card-section>

        <q-card-section class="bg-white">
          <div class="text-h6">{{ $t('How was your experience') }}</div>
          <q-rating
            v-model="rating"
            max="4"
            size="3em"
            color="yellow"
            icon="star_border"
            icon-selected="star"
            icon-half="star_half"
            no-dimming
          />
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn outline color="primary" :label="$t('Leave room open')" v-close-popup @click="justLeave"/>
          <q-btn outline color="red" :label="$t('Leave')" v-close-popup @click="closeRoom">
            <q-tooltip>
              {{ $t('All participants will be disconnected') }}
            </q-tooltip>
          </q-btn>
          <q-btn outline :label="$t('Ops!')" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import VideoControls from '../components/VideoControls'
import NekoVideo from '../components/neko/NekoVideo'
import UserVideo from '../components/UserVideo'
import Commercial from '../components/Commercial'

import '../assets/styles/vendor/_emote.scss'

export default {
  components: {
    NekoVideo,
    UserVideo,
    VideoControls,
    Commercial
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
    connected () {
      return this.$storex.room.nekoConnected
    },
    users () {
      return this.$storex.room.streams
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
      const { roomId, password } = this.$route.params
      await this.$storex.room.openOrJoin({ roomId, password })
    },
    justLeave () {
      this.$router.push('/')
    },
    async closeRoom () {
      await this.$storex.room.closeRoom()
      this.justLeave()
    },
    openCommercial () {
      window.open(this.commercialLink, '_blank')
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
    background-color: gainsboro
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
