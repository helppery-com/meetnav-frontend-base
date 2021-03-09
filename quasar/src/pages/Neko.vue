<template>
  <q-page :class="['neko-room', 'row', 'fit', hashControlClass]">
    <div class="col-2 q-pa-xs relative-position" v-if="connected">
      <div class="scroll-me">
        <Member v-for="(guest, ix) in guests" :key="ix" :member="guest" />
      </div>
    </div>
    <div class="col-10 q-pa-xs">
      <neko-video ref="nekoVideo" class="bg-black rounded-borders" />
    </div>
    <div :style="customCursor">
      <q-chip dense :icon="hasControl ? 'mouse' : 'visibility'"
        :color="hasControl ? 'accent' : me.color"
        class="text-white"
      >You!</q-chip>
    </div>
    <div v-for="(pointer, ix) in pointers"
      :key="ix"
      :style="{ ...customCursor,
              left: `${pointer.x}px`,
              top: `${pointer.y}px`
      }">
      <q-chip dense :icon="pointer.hasControl ? 'mouse' : 'visibility'"
        :color="pointer.hasControl ? 'accent' : pointer.member.color"
        class="text-white"
      >{{ pointer.member.displayname }}</q-chip>
    </div>
    <a
      href="https://github.com/nurdism/neko"
      target="_blank"
      class="watermark">
      <img
        title="powered by neko!"
        src="https://raw.githubusercontent.com/nurdism/neko/master/docs/_media/logo.png"
      />
    </a>
  </q-page>
</template>
<script>
import neko, { components } from 'neko-client/dist/neko-lib.umd'
import Member from '../components/neko/Member'
import VTooltip from 'v-tooltip'
import Vue from 'vue'

Vue.use(VTooltip, {
  defaultHtml: false
})

import 'neko-client/dist/neko-lib.css'

console.log(components)
export default {
  components: {
    ...components,
    Member
  },
  data () {
    return {
      overlayLastCursorPosition: null
    }
  },
  computed: {
    connected () {
      return neko.connected && neko.user.member
    },
    hasControl () {
      return neko.remote.hosting
    },
    hashControlClass () {
      return this.hasControl ? 'hasControl' : 'viewOnly'
    },
    userStream () {
      return neko.room.userStream
    },
    customCursor () {
      if (this.overlayLastCursorPosition === null) {
        return { display: 'none' }
      }
      const { clientX: x, clientY: y } = this.overlayLastCursorPosition
      const { y: overlayY } = this.getOverlay().getBoundingClientRect()
      return {
        left: (x + 10) + 'px',
        top: (y - overlayY - 3) + 'px',
        position: 'absolute',
        width: '24px',
        height: '24p',
        cursor: 'none',
        display: 'grid'
      }
    },
    guests () {
      return neko.user.members
    },
    pointers () {
      return [] // neko.room.pointers
    },
    me () {
      return neko.user.member
    },
    $accessor () {
      return neko
    }
  },
  created () {
    window.neko = neko
    const url = 'wss://neko_2.helppery.com:9443/' // process.env.VUE_APP_SERVER
    window.$client.initWithSettings(this, url)
    neko.login({ displayname: 'admin', password: 'admin1234!' })
    const click = () => {
      neko.setActive()
      if (neko.settings.autoplay && neko.video.playing) {
        neko.video.setMuted(false)
      }
      window.removeEventListener('click', click, false)
    }
    window.addEventListener('click', click, false)
  },
  mounted () {
    this.listenOverlayEvents()
  },
  methods: {
    getOverlay () {
      return this.$refs.nekoVideo.$refs.overlay
    },
    listenOverlayEvents () {
      const overlay = this.getOverlay()
      if (overlay) {
        // Not ready
        return setTimeout(() => this.listenOverlayEvents(), 5000)
      }
      this.onOverlayMouseMove = this.onOverlayMouseMove.bind(this)
      overlay.addEventListener('mousemove', this.onOverlayMouseMove)
    },
    onOverlayMouseMove (e) {
      this.overlayLastCursorPosition = e
      const { clientX: x, clientY: y } = this.overlayLastCursorPosition
      neko.room.sendRoomMessage({
        event: 'mousemove',
        hasControl: this.hasControl,
        x,
        y
      })
    }
  },
  beforeDestroy () {
    const overlay = this.getOverlay()
    overlay.removeEventListener('mousemove', this.onOverlayMouseMove)
  }
}
</script>
<style lang="sass">
  .neko-room
    .scroll-me
      position: absolute
      left: 0
      top: 0
      right: 0
      bottom: 0
      overflow: scroll
    &.viewOnly
      .neko-video
        .player
          .player-container
            .overlay
              background-position: center
              transition: background 0.8s
              &:hover
                background: #eccce71a radial-gradient(circle, transparent 1%, #eccce71a 1%) center/15000%
              &:active
                background-color: #eccce71a
                background-size: 100%
                transition: background 0s
    .neko-video
      .player
        .video-menu
          display: none
        .player-container
          .overlay
            cursor: none
            &:focus
              outline: none
    .watermark
      position: absolute
      right: 10px
      bottom: 10px
      img
        width: 60px
</style>
