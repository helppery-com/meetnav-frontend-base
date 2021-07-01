<template>
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
  <div
    v-else
    ref="v" :class="[
    paused ? 'paused' : '',
    isLocal ? 'me' : '',
    'user-video relative-position'
    ]">
    <div :class="{ 'user-info': true, hasControl }" v-if="showUserInfo" :dummy="updatedAt">
      <q-icon name="fas fa-mouse-pointer" color="white" v-if="hasControl"/>
      <q-icon name="mic_off" color="red" v-if="muted" />
      {{ `@${displayName}` }}
    </div>
  </div>
</template>
<script>
export default {
  props: ['stream', 'controls', 'poster', 'showUserInfo', 'videoClass'],
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
    updatedAt () {
      return this.mainStream.updatedAt
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
    }
  },
  mounted () {
    setTimeout(() => this.initVideo(), 3000)
  },
  methods: {
    initVideo () {
      this.connecting = false
      requestAnimationFrame(() => {
        const video = this.mainStream.mediaElement
        video.controls = this.controls
        if (this.muted) {
          video.volumen = 0
        }
        video.setAttribute('autoplay', true)
        if (this.videoClass) {
          video.className = this.videoClass
        }
        this.$refs.v.appendChild(video)
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
    video
      width: 100%
      height: 100%
      object-fit: cover
    &.paused
      background-image: url('/incognito-mode.png')
      background-size: cover
      background-repeat: no-repeat
      video
        opacity: 0

      .user-info
        color: $dark

    .user-info
      position: absolute
      z-index: 1
      padding: 10px
      width: 100%
      font-weight: bold
      color: white
      bottom: 0
      background-color: #171616d4
      height: 10%
      &.hasControl
        background-color: $accent
  .bg-blur
    position: absolute
    left: 0
    top: 0
    right: 0
    bottom: 0
    filter: blur(10px)
    height: 100%
</style>
