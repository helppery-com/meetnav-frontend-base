<template>
  <div ref="v" :class="[
    paused ? 'paused' : '',
    isLocal ? 'me' : '',
    'user-video relative-position'
    ]">
    <div :class="{ 'user-info': true, hasControl }" v-if="showUserInfo" :dummy="updatedAt">
      <q-icon name="fas fa-mouse-pointer" color="white" v-if="hasControl"/>
      <q-icon name="mic_off" color="red" v-if="isAudioMuted" />
      {{ `@${stream.extra.username}` }}
    </div>
  </div>
</template>
<script>
export default {
  props: ['stream', 'muted', 'controls', 'poster', 'showUserInfo', 'videoClass'],
  data () {
    return {
      isAudioMuted: false,
      isLocal: this.stream.type === 'local'
    }
  },
  computed: {
    updatedAt () {
      return this.stream.updatedAt
    },
    paused () {
      return this.$storex.room.paused
    },
    hasControl () {
      return this.$storex.room.hasControl
    }
  },
  watch: {
    updatedAt () {
      if (!this.isLocal) {
        this.isAudioMuted = this.stream.isAudioMuted
      }
    }
  },
  mounted () {
    const video = this.stream.mediaElement
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
      this.isAudioMuted = this.stream.isAudioMuted
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
    video
      width: 100%
      height: 100%
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
      top: 80%
      background-color: #17161633
      height: 40px
      &.hasControl
        background-color: $accent
</style>
