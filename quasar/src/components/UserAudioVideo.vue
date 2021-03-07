<template>
  <div class="full-width full-height row items-center justify-center">
    <q-btn round color="pink-5" v-if="userVideo" @click="toggleUserVideo" class="q-mr-xs" size="20px" icon="videocam" />
    <q-btn round color="pink-5" v-if="!userVideo" @click="toggleUserVideo"  class="q-mr-xs" size="20px" icon="videocam_off" />
    <q-btn round color="pink-5" class="q-ml-xs" v-if="userAudio" size="20px" @click="toggleUserAudio" icon="mic" />
    <q-btn round color="pink-5" class="q-ml-xs" v-if="!userAudio" size="20px" @click="toggleUserAudio" icon="mic_off" />
  </div>
</template>

<script>
export default {
  name: 'UserAudioVideo',
  data () {
    return {
      // user mic
      userAudio: true,
      // user video
      userVideo: true
    }
  },
  methods: {
    toggleUserVideo () {
      this.userVideo = !this.userVideo
    },
    toggleUserAudio () {
      this.userAudio = !this.userAudio
    }
  }
}
</script>

<style scoped>

</style>
