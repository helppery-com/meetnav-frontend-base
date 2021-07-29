<template>
  <q-card
    class="video-settings q-pa-md"
    style="width:400px"
  >
    <q-card-section class="text-h6">
      {{ $t('Video settings') }}
    </q-card-section>
    <q-card-section>
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
      micId: null
    }
  },
  computed: {
    cameraLabels () {
      return this.cameras.map(c => c.label)
    },
    micLabels () {
      return this.microphones.map(c => c.label)
    }
  },
  async created () {
    this.cameras = await this.$storex.room.rtc.cameras
    this.microphones = await this.$storex.room.rtc.microphones
    const { cameraId, micId } = this.$storex.room
    this.cameraId = this.cameras.filter(c => c.id === cameraId)[0].label
    this.micId = this.microphones.filter(c => c.id === micId)[0].label
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
    }
  }
}
</script>
