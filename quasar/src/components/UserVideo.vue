<template>
  <div ref="v" :class="[
    paused ? 'paused' : '',
    isLocal ? 'me' : '',
    'user-video relative-position'
    ]">
    <div :class="{ 'user-info': true, hasControl }" v-if="showUserInfo" :dummy="updatedAt">
      <q-icon name="fas fa-mouse-pointer" color="white" v-if="hasControl"/>
      <q-icon name="mic_off" color="red" v-if="isAudioMuted" />
      {{ `@${displayName}` }}
    </div>
  </div>
</template>
<script>
export default {
  props: ['stream', 'muted', 'controls', 'poster', 'showUserInfo', 'videoClass'],
  data () {
    return {
      isAudioMuted: false
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
      return this.isLocal && this.$storex.room.paused
    },
    host () {
      return this.$storex.room.host
    },
    hasControl () {
      return this.host && this.host.displayName === this.displayName
    },
    isLocal () {
      return this.mainStream.type === 'local'
    }
  },
  watch: {
    updatedAt () {
      if (!this.isLocal) {
        this.isAudioMuted = this.mainStream.isAudioMuted
      }
    }
  },
  mounted () {
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
    if (!this.isLocal) {
      this.isAudioMuted = this.mainStream.isAudioMuted
    }
  },
  methods: {
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
      background-image: url(https://www.seekpng.com/png/detail/73-730482_existing-user-default-avatar.png)
      background-size: contain
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
      background-color: #17161633
      height: 40px
      &.hasControl
        background-color: $accent
</style>
