<template>
  <q-card
    class="video-settings q-pa-md"
    style="width:400px"
  >
    <q-card-section class="text-h3">
      {{ $t('Room settings') }}
    </q-card-section>
    <q-card-section class="p-pl-md">
       <div class="text-h6">
        {{ $t('Video settings') }}
      </div>
      <q-select v-model="cameraId" :options="cameraLabels" :label="$t('Camera')">
        <template v-slot:prepend>
          <q-icon name="fas fa-camera" />
        </template>
      </q-select>
      <q-select v-model="micId" :options="micLabels" :label="$t('Mic')">
        <template v-slot:prepend>
          <q-icon name="fas fa-microphone-alt" />
        </template>
      </q-select>
    </q-card-section>
    <q-card-section class="p-pl-md">
       <div class="text-h6">
        {{ $t('Browser settings') }}
      </div>
      <q-select v-model="resId" :options="resolutionLabel" :label="$t('Resolution')">
        <template v-slot:prepend>
          <q-icon name="tv" />
        </template>
      </q-select>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn :label="$t('Apply')" v-close-popup @click="apply" />
      <q-btn :label="$t('cancel')" color="red" v-close-popup />
    </q-card-actions>
  </q-card>
</template>
<script>
export default {
  data () {
    return {
      cameras: [],
      cameraId: null,
      microphones: [],
      micId: null,
      resId: null
    }
  },
  computed: {
    cameraLabels () {
      return this.cameras.map(c => c.label)
    },
    micLabels () {
      return this.microphones.map(c => c.label)
    },
    resolutionLabel () {
      const confs = this.$storex.room.configurations
      return confs.map(c => `${c.width}x${c.height}`)
    },
    currentResId () {
      const { w, h } = this.$storex.room.neko.video.resolution
      return `${w}x${h}`
    }
  },
  async created () {
    this.cameras = await this.$storex.room.rtc.cameras
    this.microphones = await this.$storex.room.rtc.microphones
    const { cameraId, micId } = this.$storex.room
    this.cameraId = this.cameras.filter(c => c.id === cameraId)[0].label
    this.micId = this.microphones.filter(c => c.id === micId)[0].label
    this.resId = this.currentResId
  },
  methods: {
    setCamera (camera) {
      this.cameraId = camera.id
    },
    setMicrophone (mic) {
      this.micId = mic.id
    },
    async apply () {
      const { room } = this.$storex
      const cameraId = this.cameras.filter(c => c.label === this.cameraId)[0].id
      const micId = this.microphones.filter(c => c.label === this.micId)[0].id
      room.setCamera(cameraId)
      room.setMicrophone(micId)
      if (room.cameraConnected) {
        room.connectVideoChat()
      }
      if (this.resId !== this.currentResId) {
        const parts = this.resId.split('x')
        this.$storex.room.neko.video.screenSet({
          width: parseInt(parts[0]),
          height: parseInt(parts[1]),
          rate: 60
        })
      }
    }
  }
}
</script>
