<template>
  <div class="q-gutter-xs row">
    <q-btn flat
      icon="fas fa-share-alt"
      text-color="white"
      :label="roomId"
      class="col-auto q-ml-md q-mr-md bg-dark" @click="share = true"/>
    <q-btn round outline
      :icon="rtcmuted ? 'fas fa-microphone-alt-slash' : 'fas fa-microphone-alt'"
      :text-color="rtcmuted ? 'red' : 'dark'"
      class="col-auto bg-grey-3" @click="toggleAudio" />
    <q-btn round outline
      v-for="(camera, ix) in cameras" :key="ix"
      :icon="paused ? 'fas fa-video-slash' : 'fas fa-video'"
      :text-color="paused  ? 'red' : 'dark'"
      class="col-auto q-ml-xs bg-grey-3" @click="toggleVideo(ix)">
      <q-tooltip>
        {{ camera.label }}
      </q-tooltip>
    </q-btn>
    <q-btn round outline
      :icon="locked ? 'lock' : 'lock_open'"
      :text-color="locked ? 'red' : 'dark'"
      class="col-auto q-ml-xl q-ml-xs bg-grey-3" @click="toogleLock"
      v-if="isAdmin"
    >
      <q-tooltip>
        <div v-if="locked" class="text-h6 text-white">
          {{ $t('Room is locked, new users will need the password to join') }}
        </div>
        <div v-else class="text-h6">
          {{ $t('Room is open to any user with the room link. Click to lock.') }}
        </div>
        <div class="text-h6">{{ $t('Room password: ') + ' ' + roomPassord }}</div>
      </q-tooltip>
    </q-btn>
    <q-btn round outline
      :icon="fullScreen ? 'fas fa-compress' : 'fas fa-expand'"
      text-color="dark"
      class="col-auto q-ml-xl q-ml-xs bg-grey-3" @click="toogleFullScreen"/>
    <q-btn round outline
      text-color="accent"
      class="col-auto bg-grey-3"
      icon="chat" @click="$storex.room.toggleChat()" />
    <q-btn round outline
      text-color="white"
      class="col-auto q-ml-xl bg-red"
      icon="logout"
      @click="leave = true"/>
    <q-dialog v-model="share" transition-show="scale" transition-hide="scale">
      <q-card class="bg-white text-primary" style="width: 600px">
        <q-card-section>
          <div class="text-h5">
            {{ $t('Share') }}
          </div>
        </q-card-section>

        <q-card-section class="bg-white">
          <Social :url="shareUrl"/>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn outline :label="$t('Back')" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="leave" transition-show="scale" transition-hide="scale">
      <q-card class="bg-white text-primary" style="width: 600px">
        <q-card-section>
          <div class="text-h5">
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
          <q-btn outline color="accent" :label="$t('Exit room')" v-close-popup @click="closeRoom"/>
          <q-btn outline color="red" :label="$t('Close room')" v-close-popup @click="closeRoom(true)" v-if="isRoomAdmin" />
          <q-btn outline :label="$t('Back')" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import Social from '../components/Social'
import { AppFullscreen } from 'quasar'

export default {
  components: {
    Social
  },
  data () {
    return {
      share: false,
      text: '',
      rating: 0,
      fullScreen: false,
      chatStatus: this.$storex.room.showChat,
      leave: false
    }
  },
  computed: {
    isRoomAdmin () {
      return this.$storex.room.room && this.$storex.room.room.isAdmin
    },
    nekoConnected () {
      return this.$storex.room.nekoConnected
    },
    paused () {
      return this.$storex.room.paused
    },
    rtcmuted () {
      return this.$storex.room.muted
    },
    volume () {
      return this.$storex.room.neko.video.volume
    },
    muted () {
      return this.$storex.room.neko.video.muted || !this.$storex.room.neko.video.volume
    },
    volumeIcon () {
      if (this.muted) {
        return 'volume_off'
      }
      return 'volume_up'
    },
    active () {
      return this.$storex.room.nekoactive
    },
    hasControl () {
      return this.$storex.room.neko.remote.hosting
    },
    screens () {
      return this.$storex.room.neko.video.configurations
        .filter((v, ix, arr) => ix === arr.findIndex(c => c.width === v.width))
        .sort((a, b) => a.width > b.width ? -1 : 1)
    },
    maxZoomSize () {
      return this.screens.length - 1
    },
    currentZoom () {
      return {
        ...this.$storex.room.neko.video.resolution,
        rate: this.$storex.room.neko.video.rate
      }
    },
    zoomIndex () {
      return this.screens.findIndex(c =>
        c.width === this.$storex.room.neko.video.width &&
        c.height === this.$storex.room.neko.video.height)
    },
    zoomLabel () {
      return `${this.$storex.room.neko.video.width}x${this.$storex.room.neko.video.height}`
    },
    me () {
      return this.$storex.room.neko.user.member
    },
    shareUrl () {
      return window.location.href
    },
    cameras () {
      // TODO: Add camera switch
      const camera = this.$storex.room.cameras[0]
      return camera ? [camera] : []
    },
    isAdmin () {
      return this.$storex.room.room && this.$storex.room.room.isAdmin
    },
    roomId () {
      return this.$storex.room.roomId
    },
    locked () {
      return this.$storex.room.room && this.$storex.room.room.passwordProtected
    },
    roomPassord () {
      return this.$storex.room.room && this.$storex.room.room.password
    }
  },
  methods: {
    toggleVideo () {
      this.$storex.room.toggleVideo()
    },
    toggleAudio () {
      this.$storex.room.toggleAudio()
    },
    setVolume (volume) {
      this.$storex.room.neko.video.setVolume(volume)
      if (volume > 0) {
        this.$storex.room.neko.video.setMuted(false)
      }
    },
    setZoom (ix) {
      if (ix < 0 || ix >= this.screens.length || ix === this.zoomIndex) {
        return
      }
      const resolution = this.screens[ix]
      this.$storex.room.neko.video.setResolution(resolution)
      console.log('Set resolution....', this.zoomLabel)
    },
    notifyChat () {
      console.log('Emit chat')
      this.$emit('chat')
    },
    sendMessage () {
      this.$emit('message', this.text)
      this.text = null
    },
    async toogleFullScreen () {
      if (this.fullScreen) {
        await AppFullscreen.exit()
        this.fullScreen = false
        if (this.chatStatus !== this.$storex.room.showChat) {
          this.$storex.room.toggleChat()
        }
      } else {
        await AppFullscreen.request()
        this.fullScreen = true
        this.chatStatus = this.$storex.room.showChat
        if (this.chatStatus) {
          this.$storex.room.toggleChat()
        }
      }
    },
    async toogleLock () {
      this.$storex.room.room.passwordProtected = !this.$storex.room.room.passwordProtected
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
  .emotes .fas.fa-grin-beam
    color: #ffc107
</style>
