<template>
  <div class="full-height flex items-center" style="position: relative;width: fit-content">
    <q-icon name="volume_up" size="50px"  v-if="muteSpeaker" style="color: white" @click="showMobileSlider"></q-icon>
    <q-icon name="volume_off" v-if="!muteSpeaker" size="50px" style="color: white" @click="showMobileSlider"></q-icon>
    <div class="bg-black flex justify-center mobile-volume-slider" v-if="mobileSpeakerSlider">
      <q-slider
        v-model="soundVolume"
        :step="1"
        color="white"
        vertical
        reverse
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'VolumeControls',
  data () {
    return {
      // user speaker muted
      muteSpeaker: false,
      // controls the display of user volume slider in mobile view
      mobileSpeakerSlider: false,
      // displayed sound level
      soundVolume: 0
    }
  },
  methods: {
    showMobileSlider () {
      this.mobileSpeakerSlider = !this.mobileSpeakerSlider
    }
  }
}
</script>

<style scoped lang="sass">
.mobile-volume-slider
  display: none
@media screen and (max-width: 600px)
.mobile-volume-slider
  display: flex
  width: 100%
  height: 180px
  position: absolute
  bottom: 100%
  left: 50%
  z-index: 8
</style>
