<template>
  <div class="q-gutter-xs row">
    <q-btn round outline
      :icon="rtcmuted ? 'fas fa-microphone-alt-slash' : 'fas fa-microphone-alt'"
      :color="rtcmuted ? 'dark' : 'primary'"
      class="col-auto" @click="toggleAudio" />
    <q-icon name="fas fa-sign-out-alt" color="red" class="col-auto btn" @click="leave = true" size="xl"/>
    <q-btn round outline
      v-for="(camera, ix) in cameras" :key="ix"
      :icon="paused ? 'fas fa-video-slash' : 'fas fa-video'"
      :color="paused  ? 'dark' : 'primary'"
      class="col-auto" @click="toggleVideo(ix)">
      <q-tooltip>
        {{ camera.label }}
      </q-tooltip>
    </q-btn>
    <q-btn round outline
      :icon="fullScreen ? 'fas fa-compress' : 'fas fa-expand'"
      color="dark"
      class="col-auto" @click="toogleFullScreen"/>
    <q-btn round outline
      icon="fas fa-share-alt"
      color="accent"
      class="col-auto" @click="share = true"/>
    <q-btn round outline icon="chat" @click="$storex.room.toggleChat()" />
    <NekoEmotes />
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
          <q-btn outline color="red" :label="$t('Close room')" v-close-popup @click="closeRoom(true)" v-if="isAdmin" />
          <q-btn outline :label="$t('Back')" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { NekoEmotes } from 'neko-client/dist/neko-lib.umd'
import Social from '../components/Social'
import { AppFullscreen } from 'quasar'

export default {
  components: {
    NekoEmotes,
    Social
  },
  data () {
    return {
      leave: false,
      share: false,
      text: '',
      rating: 0,
      fullScreen: false,
      chatStatus: this.$storex.room.showChat
    }
  },
  computed: {
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
    justLeave () {
      this.$router.push('/')
    },
    closeRoom (close) {
      this.$storex.room.closeRoom(close)
      this.justLeave()
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
    }
  }
}
</script>
<style lang="sass">
  .emotes .fas.fa-grin-beam
    color: #ffc107
</style>
