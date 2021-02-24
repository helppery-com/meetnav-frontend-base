<template>
  <div class="q-gutter-xs">
    <q-btn outline :icon="hasControl ? 'fas fa-mouse-pointer' : 'visibility'" @click="toggleControls" :color="hasControl ? 'accent' : 'grey'" :label="$t('room.takeControl')"/>
    <q-btn outline icon="speaker" :color="muted ? 'grey': 'dark'">
      <q-menu>
        <q-list style="min-width: 200px">
          <q-item clickable v-close-popup>
            <q-item-section side>
              <q-icon name="volume_off" :color="muted ? 'dark' : 'grey'" @click="toggleMuted"/>
            </q-item-section>
            <q-item-section>
              <q-slider
                :value="volume"
                color="green"
                markers
                snap
                :min="0"
                :max="100"
                @input="setVolume"
              />
            </q-item-section>
              <q-item-section side>
              <q-icon name="volume_up" @click="setVolume(100)"/>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <q-btn outline icon="fit_screen" color="black" v-if="me.admin">
      <q-menu>
        <q-list style="min-width: 200px" class="q-pt-md">
          <q-item clickable v-close-popup>
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
    <q-btn outline icon="explore_off" color="red" @click="leaveRoom = true">
      <q-dialog v-model="leaveRoom" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="explore_off" color="red" text-color="white" />
            <span class="q-ml-sm">{{ $t('room.logoutConfirm') }}</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat :label="$t('cancel')" color="primary" v-close-popup />
            <q-btn flat :label="$t('ok')" color="primary" v-close-popup @click="leave"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-btn>
  </div>
</template>
<script>
import neko from 'neko/dist/neko-lib.umd'
export default {
  data () {
    return {
      leaveRoom: false
    }
  },
  computed: {
    volume () {
      return neko.video.volume
    },
    muted () {
      return neko.video.muted || !neko.video.volume
    },
    volumeIcon () {
      if (this.muted) {
        return 'volume_off'
      }
      return 'volume_up'
    },
    active () {
      return neko.active
    },
    hasControl () {
      return neko.remote.hosting
    },
    hasVideo () {
      return neko.room.userStream && !neko.room.paused
    },
    screens () {
      return neko.video.configurations
        .filter((v, ix, arr) => ix === arr.findIndex(c => c.width === v.width))
        .sort((a, b) => a.width > b.width ? -1 : 1)
    },
    maxZoomSize () {
      return this.screens.length - 1
    },
    currentZoom () {
      return {
        ...neko.video.resolution,
        rate: neko.video.rate
      }
    },
    zoomIndex () {
      return this.screens.findIndex(c =>
        c.width === neko.video.width &&
        c.height === neko.video.height)
    },
    zoomLabel () {
      return `${neko.video.width}x${neko.video.height}`
    },
    me () {
      return neko.user.member
    }
  },
  methods: {
    toggleControls () {
      neko.remote.toggle()
    },
    toggleMuted () {
      neko.video.setMuted(!neko.video.muted)
    },
    setVolume (volume) {
      neko.video.setVolume(volume)
      if (volume > 0) {
        neko.video.setMuted(false)
      }
    },
    setZoom (ix) {
      if (ix < 0 || ix >= this.screens.length || ix === this.zoomIndex) {
        return
      }
      const resolution = this.screens[ix]
      neko.video.setResolution(resolution)
      console.log('Set resolution....', this.zoomLabel)
    },
    leave () {
      neko.logout()
      this.$router.push('/')
    }
  }
}
</script>
