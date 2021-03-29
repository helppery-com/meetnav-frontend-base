<template>
  <div class="q-gutter-xs row">
    <q-btn outline color="red" size="xs" class="col" @click="$emit('leave')">
      <q-icon name="hourglass_bottom" />
      {{ '30\'' }}
    </q-btn>
    <q-btn outline color="primary" class="col" :icon="paused ? 'fas fa-video-slash': 'fas fa-video'" @click="toggleVideo()" />
    <q-btn outline color="primary" class="col" :icon="rtcmuted ? 'fas fa-microphone-alt-slash': 'fas fa-microphone-alt'" @click="toggleAudio()" />
    <q-btn outline icon="fas fa-ellipsis-h" color="black">
      <q-menu>
        <q-list style="min-width: 200px" class="q-pt-md">
          <q-item clickable v-close-popup v-if="nekoConnected && me">
            <q-item-section side>
              <q-icon name="zoom_out" @click="setZoom(zoomIndex - 1)" />
            </q-item-section>
            <q-item-section>
              <q-slider
                :value="zoomIndex"
                color="green"
                markers
                snap
                :min="0"
                :max="maxZoomSize"
                label
                :label-value="zoomLabel"
                @input="setZoom"
              />
            </q-item-section>
            <q-item-section side>
              <q-icon name="zoom_in" @click="setZoom(zoomIndex + 1)" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
  </div>
</template>
<script>
export default {
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
    }
  }
}
</script>
