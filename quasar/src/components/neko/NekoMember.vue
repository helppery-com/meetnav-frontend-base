<template>
  <div class="neko-member relative-position">
    <div class='box ratio4_3' >
        <img class="content" width="100%" :src="poster" v-if="!stream || paused"/>
        <UserVideo :stream="stream" class="content" v-else />
    </div>
    <div class="controls q-px-md q-py-xs full-width q-gutter-xs">
      <q-btn outline :icon="paused ? 'videocam_off' : 'videocam'" @click="toggleVideo" :color="paused ? 'grey' : 'accent'" v-if="isMe" />
      <q-btn outline :icon="muted ? 'mic_off' : 'mic'" @click="toggleAudio" :color="muted ? 'grey' : 'accent'" v-if="isMe" />
      <span v-if="!isMe">{{ member.displayname }}</span>
    </div>
  </div>
</template>
<script>
import UserVideo from './UserVideo'
import neko from 'neko-client/dist/neko-lib.umd'

export default {
  props: ['member'],
  components: { UserVideo },
  computed: {
    connected () {
      return neko.room.connected
    },
    paused () {
      return neko.room.paused
    },
    muted () {
      return neko.room.muted
    },
    isMe () {
      return this.member.id === neko.user.member.id
    },
    stream () {
      if (this.isMe) {
        return neko.room.userStream
      }
      return null
    },
    poster () {
      const { displayname } = this.member
      return `https://ui-avatars.com/api/?name=${displayname}.png&size=50`
    }
  },
  methods: {
    toggleVideo () {
      neko.room.toggleVideo()
    },
    toggleAudio () {
      neko.room.toggleAudio()
    }
  }
}
</script>
<style lang="sass">
  .neko-member
    video
      -o-transform : scaleX(-1)
      -moz-transform : scaleX(-1)
      -webkit-transform : scaleX(-1)
      -ms-transform: scaleX(-1)
      transform : scaleX(-1)

    .controls
      position: absolute
      bottom: 0
      background-color: #00000094

    .box
      position: relative
      width: 100%
      margin: 5px

      &:before
        content: ""
        display: block
        padding-top: 100%

    .content
      position: absolute
      top: 0
      left: 0
      bottom: 0
      right: 0
      line-height:100%
      height:100%
      text-align: center
      display: flex
      align-items: center
      justify-content: center
      background-color: $grey

    .ratio4_3:before
      padding-top: 75%
</style>
