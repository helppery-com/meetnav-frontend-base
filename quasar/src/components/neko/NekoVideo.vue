<template>
  <div :class="['neko-video', '', hashControlClass]" ref="pointerLayer">
    <neko-video ref="nekoVideo" class="rounded-borders" />
    <div class="me-pointer" :style="customCursor">
      <q-chip dense :icon="hasControl ? 'mouse' : 'visibility'"
        :color="hasControl ? 'primary' : 'dark'"
        class="text-white"
        v-if="me && !hasControl"
      >{{ hasControl ? 'You!' : 'You, click to control!' }}</q-chip>
    </div>
    <div v-for="(pointer, ix) in pointers"
      :key="ix"
      :style="remotePointerStyle(pointer)">
      <q-chip dense :icon="pointer.hasControl ? 'mouse' : 'visibility'"
        :color="pointer.hasControl ? 'primary' : pointer.color"
        class="text-white"
      >{{ pointer.username }}</q-chip>
    </div>
    <!-- canvas ref="bgCanvas" class="bg-canvas"/ -->
  </div>
</template>
<script>
import neko, { NekoVideo } from 'neko-client/dist/neko-lib.umd'
import 'neko-client/dist/neko-lib.css'

class TouchToMouse {
  target = null
  touchstart = null
  touchmove = null
  scrollInvert = false
  onEvent = event => {}
  constructor (target, scrollInvert) {
    this.target = target
    this.scrollInvert = scrollInvert
    this.onTouch = this.onTouch.bind(this)
    target.addEventListener('touchstart', this.onTouch)
    target.addEventListener('touchend', this.onTouch)
    target.addEventListener('touchcancel', this.onTouch)
    target.addEventListener('touchmove', this.onTouch)
  }

  onTouch (event) {
    event.preventDefault()
    const { type, touches } = event
    if (type === 'touchstart') {
      this.touchstart = event
      this.clientX = touches[0].clientX
      this.clientY = touches[0].clientY
      this.touchmove = null
    }
    if (type === 'touchmove') {
      this.touchmove = event
    }
    if (type === 'touchend') {
      const { clientX, clientY, screenX, screenY } = this.touchstart.touches[0]
      const { touches: touchesEnd } = this.touchmove || {}
      if (touchesEnd && touchesEnd.length) {
        let deltaX = touchesEnd[0].clientX - clientX
        let deltaY = touchesEnd[0].clientY - clientY
        const absX = Math.abs(deltaX)
        const absY = Math.abs(deltaY)
        const { width, height } = this.target.getBoundingClientRect()
        const propX = 100 / width * absX
        const propY = 100 / height * absY
        if (Math.max(propX, propY) > 10) {
          if (this.scrollInvert) {
            deltaY = deltaY * -1
            deltaX = deltaX * -1
          }
          const wheelEv = new WheelEvent('wheel',
            {
              eventType: 'mousewheel',
              canBubble: true,
              cancelable: true,
              view: window,
              detail: 1,
              screenX: screenX,
              screenY: screenY,
              clientX: clientX,
              clientY: clientY,
              button: false,
              relatedTarget: this.target,
              modifiersList: null,
              deltaX: deltaX,
              deltaY: deltaY,
              deltaZ: 0,
              deltaMode: 0 /* https://webplatform.github.io/docs/dom/WheelEvent/deltaMode/ */
            })
          this.onEvent({
            ...event,
            type: 'touchtowheel',
            absX,
            absY,
            width,
            height,
            propX,
            propY
          })
          return this.target.dispatchEvent(wheelEv)
        }
      }
      const mouse = document.createEvent('MouseEvent')
      mouse.initMouseEvent('mousedown', true, true, window, 1,
        screenX, screenY,
        clientX, clientY, false,
        false, false, false, 0/* left */, null)
      this.onEvent({ ...event, type: 'touchtomousedown' })
      this.target.dispatchEvent(mouse)
      mouse.initMouseEvent('mouseup', true, true, window, 1,
        screenX, screenY,
        clientX, clientY, false,
        false, false, false, 0/* left */, null)
      this.target.dispatchEvent(mouse)
    }
  }
}

export default {
  components: {
    NekoVideo
  },
  data () {
    return {
      overlayLastCursorPosition: null,
      touchManager: null,
      bgContext: null
    }
  },
  computed: {
    connected () {
      return neko.connected && neko.user.member
    },
    hasControl () {
      return this.$storex.room.hasControl
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
      const { layerX: x, layerY: y, target } = this.overlayLastCursorPosition
      const { left } = target.getBoundingClientRect()
      return {
        left: (x + left + 3) + 'px',
        top: y + 'px',
        position: 'absolute',
        width: '24px',
        height: '24p',
        display: 'grid'
      }
    },
    guests () {
      return neko.user.members
    },
    pointers () {
      return this.$storex.room.pointers
    },
    me () {
      return neko.user.member
    },
    $accessor () {
      return neko
    },
    scroll () {
      return neko.settings.scroll
    },
    scroll_invert () {
      return neko.settings.scroll_invert
    },
    videoWidth () {
      return this.getVideo().videoWidth
    }
  },
  watch: {
    connected (newVal) {
      if (newVal) {
        this.$emit('connected', this)
      }
    }
  },
  created () {
  },
  mounted () {
    this.listenOverlayEvents()
    // this.bgContext = this.$refs.bgCanvas.getContext('2d')
    // this.updateBgCanvas()
  },
  methods: {
    remotePointerStyle (pointer) {
      const { px, py } = pointer
      const overlay = this.getOverlay()
      const x = overlay.clientWidth / 100 * px
      const y = overlay.clientHeight / 100 * py
      const { left } = overlay.getBoundingClientRect()
      return {
        ...this.customCursor,
        left: `${left + x}px`,
        top: `${y}px`
      }
    },
    updateBgCanvas () {
      const video = this.getVideo()
      if (video) {
        const { width, height } = this.$refs.bgCanvas.getBoundingClientRect()
        // fill horizontally
        // const vRatio = (height / video.videoHeight) * video.videoWidth
        // const hRatio = (width / video.videoWidth) * video.videoHeight
        this.bgContext.drawImage(video, 0, 0, width, height)
      }
      requestAnimationFrame(() => this.updateBgCanvas())
    },
    getOverlay () {
      return this.$refs.nekoVideo ? this.$refs.nekoVideo.$refs.overlay
        : null
    },
    getVideo () {
      return this.$refs.nekoVideo ? this.$refs.nekoVideo.$refs.video
        : null
    },
    getPlayer () {
      return this.$refs.nekoVideo.$refs.player
    },
    listenOverlayEvents () {
      const overlay = this.getOverlay()
      if (!overlay) {
        // Not ready
        return setTimeout(() => this.listenOverlayEvents(), 5000)
      }
      this.onOverlayMouseMove = this.onOverlayMouseMove.bind(this)
      this.onOverlayMousedown = this.onOverlayMousedown.bind(this)
      this.onWheel = this.onWheel.bind(this)
      overlay.addEventListener('mousemove', this.onOverlayMouseMove)
      overlay.addEventListener('mousedown', this.onOverlayMousedown)
      overlay.addEventListener('wheel', this.onWheel)

      this.touchManager = new TouchToMouse(overlay, this.scroll_invert)
      this.touchManager.onEvent = event => {
        console.log('onEvent', event)
        this.$storex.room.sendRoomMessage({
          ...event,
          event: 'touchevent',
          type: event.type,
          touch: event.touches ? event.touches[0] : null
        })
      }
    },
    onOverlayMouseMove (e) {
      this.overlayLastCursorPosition = e
      const { layerX, layerY, target } = this.overlayLastCursorPosition
      const px = 100 / target.clientWidth * layerX
      const py = 100 / target.clientHeight * layerY
      this.$storex.room.sendRoomMessage({
        event: 'mousemove',
        hasControl: this.hasControl,
        px,
        py
      })
    },
    onOverlayMousedown (e) {
      this.$storex.room.requestControls()
    },
    onWheel (e) {
      const { w, h } = neko.video.resolution
      const rect = this.getOverlay().getBoundingClientRect()
      this.$storex.room.sendRoomMessage({
        event: 'mousemove',
        x: Math.round((w / rect.width) * (e.clientX - rect.left)),
        y: Math.round((h / rect.height) * (e.clientY - rect.top))
      })
      let x = e.deltaX
      let y = e.deltaY

      if (this.scroll_invert) {
        x = x * -1
        y = y * -1
      }

      x = Math.min(Math.max(x, -this.scroll), this.scroll)
      y = Math.min(Math.max(y, -this.scroll), this.scroll)

      this.$storex.room.sendRoomMessage({ event: 'wheel', x, y })
    },
    mapTouchEventToMouseEvent (event) {
      const touches = event.changedTouches
      const first = touches[0]
      let type = ''
      switch (event.type) {
        case 'touchstart':
          type = 'mousedown'
          break
        case 'touchmove':
          type = 'mousemove'
          break
        case 'touchend':
          type = 'mouseup'
          break
        default:
          return
      }

      // initMouseEvent(type, canBubble, cancelable, view, clickCount,
      //                screenX, screenY, clientX, clientY, ctrlKey,
      //                altKey, shiftKey, metaKey, button, relatedTarget);

      var simulatedEvent = document.createEvent('MouseEvent')
      simulatedEvent.initMouseEvent(type, true, true, window, 1,
        first.screenX, first.screenY,
        first.clientX, first.clientY, false,
        false, false, false, 0/* left */, null)

      first.target.dispatchEvent(simulatedEvent)
      event.preventDefault()
    },
    onTouch (e) {
      if (e.touches.length > 10) { // Disabled
        return this.mapTouchEventToMouseEvent(e)
      }
      const touches = []
      for (let c = 0; c !== e.touches.length; ++c) {
        const t = e.touches[c]
        touches.push({
          clientX: t.clientX,
          clientY: t.clientY,
          force: t.force,
          identifier: t.identifier,
          pageX: t.pageX,
          pageY: t.pageY,
          radiusX: t.radiusX,
          radiusY: t.radiusY,
          rotationAngle: t.rotationAngle,
          screenX: t.screenX,
          screenY: t.screenY
        })
      }
      /* const msg = {
        event: e.type,
        touches: touches
      } */
      // this.$storex.room.sendRoomMessage(msg)
      const touch = touches.length ? touches[0] : {}
      console.log({ event: e.type, ...touch })
      e.preventDefault()
      if (e.type === 'touchmove') {
        this.onWheel(e)
      } else {
        this.mapTouchEventToMouseEvent(e)
      }
    }
  },
  beforeDestroy () {
    const overlay = this.getOverlay()
    overlay.removeEventListener('mousemove', this.onOverlayMouseMove)
    overlay.removeEventListener('mousedown', this.onOverlayMousedown)
    overlay.removeEventListener('wheel', this.onWheel)
  }
}
</script>
<style lang="sass">
  .neko-video
    .bg-canvas
      display: none
      position: absolute
      z-index: 0
      left: 0
      top: 0
      right: 0
      bottom: 0
    .scroll-me
      position: absolute
      left: 0
      top: 0
      right: 0
      bottom: 0
      overflow: scroll
    .video
      .player
        align-items: self-start
        .video-menu
          display: none
        .player-container
          video
            border-radius: 5px
          .overlay

            &:focus
              outline: none
            background-position: center
            transition: background 0.8s
    &.viewOnly
      .overlay
        cursor: none
</style>
