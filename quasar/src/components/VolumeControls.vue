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
import { mapMutations} from 'vuex'
export default {
  name: 'VolumeControls',
  data () {
    return {
    }
  },
  mounted () {
    this.soundVolume = this.getCurrentVolume
  },
  computed: {
    getCurrentVolume () {
      return this.$store.state.application.soundVolume
    }
  },
  methods: {
    ...mapMutations({
      updateVolume: 'application/updateSoundVolume'
    }),

  },
  watch: {
    soundVolume: function (newVal) {
      this.updateVolume(newVal)
    }
  }
}
</script>

<style scoped lang="sass">

@media screen and (max-width: 600px)

</style>
