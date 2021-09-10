<template>
  <div class="user-video relative-position">
    <SoundBars
      :sound="speaking"
      :muted="muted"
      v-if="false"
    /><!-- Disabled -->
    <div
      class="video-container fit"
      ref="videoContainer"
    >
      <video ref="video" autoplay :muted="isLocal" />
      <div class="user-info row">
        <div class="col-auto q-pa-md">{{ `@${displayName}`}}</div>
        <div class="col controls">
          <q-separator />
          <q-btn flat round
            :icon="room.me.paused ? 'fas fa-video-slash' : 'fas fa-video'"
            @click="room.toggleVideo()"
            size="md"
            v-if="isLocal"
          />
          <q-btn flat round
            :icon="room.me.muted ? 'fas fa-microphone-alt-slash' : 'fas fa-microphone-alt'"
            @click="room.toggleAudio()"
            size="md"
            v-if="isLocal"
          />
        </div>
      </div>
    </div>
    <q-card
      class="connecting-card relative-position fit"
      v-if="connecting || paused">
      <img :src="user.avatar" class="bg-blur" />
      <q-card-section class="fit">
        <div class="column justify-center fit">
          <q-avatar class="col-auto self-center pulse">
            <img :src="user.avatar" />
          </q-avatar>
          <div class="col-auto self-center text-h6 text-accent" v-if="connecting">
            {{ $t('Connecting...') }}
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import SoundBars from './SoundBars'
export default {
  components: {
    SoundBars
  },
  props: ['stream'],
  data () {
    return {
      connecting: true
    }
  },
  computed: {
    displayName () {
      return this.mainStream.extra.username
    },
    mainStream () {
      return this.stream[0]
    },
    paused () {
      return this.isLocal ? this.$storex.room.paused : this.mainStream.extra.paused
    },
    muted () {
      return this.isLocal ? this.$storex.room.muted : this.mainStream.extra.muted
    },
    host () {
      return this.$storex.room.host
    },
    hasControl () {
      return this.host && this.host.displayName === this.displayName
    },
    isLocal () {
      return this.mainStream.type === 'local'
    },
    user () {
      return this.mainStream.extra
    },
    speaking () {
      return this.user.speaking
    },
    room () {
      return this.$storex.room
    },
    srcObject () {
      return this.mainStream.stream
    },
    controlIncon () {
      if (this.isLocal) {
        return null
      }
      return this.hasControl ? 'fas fa-mouse-pointer' : 'fas fa-eye'
    }
  },
  watch: {
    connecting (val) {
      this.$emit('connecting', val)
    }
  },
  mounted () {
    setTimeout(() => this.initVideo(), 3000)
  },
  methods: {
    initVideo () {
      this.connecting = false
      requestAnimationFrame(() => {
        const { video } = this.$refs
        if ('srcObject' in video) {
          video.srcObject = this.srcObject
        } else {
          // @ts-ignore
          video.src = window.URL.createObjectURL(this.srcObject) // for older browsers
        }
        if (this.muted || this.isLocal) {
          video.volumen = 0
        }
      })
    },
    releaseControl () {
      this.$storex.room.neko.remote.release()
    }
  }
}
</script>
<style lang="sass">
  .user-video
    width: 100%
    height: 100%
    .video-container
      position: relative
    .connecting-card
      min-height: 200px
      min-width: 100%
    video
      width: 100%
      height: 100%
      object-fit: cover
      transform: rotateY(180deg)
      -webkit-transform:rotateY(180deg) /* Safari and Chrome */
      -moz-transform:rotateY(180deg) /* Firefox */
      border-radius: 10px
    &.paused
      background-image: url('/incognito-mode.png')
      background-size: cover
      background-repeat: no-repeat
      video
        opacity: 0

    .user-info
      position: absolute
      background-color: #171616d4
      color: white
      z-index: 1
      width: 100%
      bottom: 0
      .controls
        text-align: right
  .bg-blur
    position: absolute
    left: 0
    top: 0
    right: 0
    bottom: 0
    filter: blur(10px)
    height: 100%
  .connecting-card
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 0
  .sound-bars
    position: absolute
    z-index: 1
    left: 10px
    bottom: 5px
</style>
