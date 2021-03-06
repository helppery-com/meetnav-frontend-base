<template>
<q-page class="full-width flex column adjusted-height overflow-hidden">
  <!-- the connection dialogue -->
  <connection-dialogue></connection-dialogue>
  <!-- main layout -->
  <div class="main-height full-width flex ">
    <!--  sidebar  -->
    <div class=" column curved-dark-shadow q-mr-sm items-center overflow-auto justify-start" style="flex: 1;display: flex">
    <!--   meeting participants   -->
      <participant-component height="100%" width="100%" show-icons="true"></participant-component>
    </div>
      <!--  browse share  -->
    <div class="co-browser curved-dark-shadow full-height">
      <invite-people></invite-people>
    </div>
  </div>
  <!-- control layout -->
  <div class="control-height flex column justify-start full-width bg-black">
  <!--  seekbar  -->
    <div class="full-width bg-grey" style="height: 5px; position: relative">

      <!--  red seekbar    -->
      <div class="full-height bg-red" style="top: 0; z-index: 3" id="redseekBar"></div>
      <!--  ADS markers    -->
      <div class="full-height bg-yellow" style="z-index: 1000; width: 20px; top:0;"></div>

    </div>
    <!--  controls  -->
    <div class="row full-width" style="height: calc( 100% - 5px)">
      <div class="col-4 row  items-baseline justify-start">
        <div class="col-2 flex column full-height justify-center">
        <q-icon name="volume_up" size="50px" style="color: white"></q-icon>
        </div>
        <div class="col-4 flex column full-height justify-center">
        <div class="volume-control">
        <q-slider
          v-model="soundVolume"
          :step="1"
          class="text-white"
        />
        </div>
        </div>
        <div class="col  flex column full-height items-center justify-start">
        <p class="text-h6 q-ml-md text-white">00:45 / 01:00:00</p>
        </div>
      </div>
      <div class="col-4">
        <div class="full-width full-height row items-center justify-center">
          <q-btn round color="pink-5" class="q-mr-xs" size="20px" icon="videocam_off" />
          <q-btn round color="pink-5" class="q-ml-xs" size="20px" icon="mic_off" />
        </div>
      </div>
      <div class="col-4 full-height column flex">
        <div class="full-width full-height flex justify-end items-center">
          <q-icon name="settings" class="q-mr-xs" style="color: white;" size="50px"></q-icon>
          <q-icon name="keyboard" class="q-mr-xs" style="color: white;" size="50px"></q-icon>
          <q-icon name="fullscreen" class="q-mr-xs" style="color: white;" size="50px"></q-icon>
        </div>

      </div>
    </div>
  </div>
</q-page>
</template>

<script>
import ParticipantComponent from 'components/ParticipantComponent'
import InvitePeople from 'components/InvitePeople'
import ConnectionDialogue from 'components/ConnectionDialogue'

export default {
  name: 'cobrowse',
  data () {
    return {
      redSeekBarWidth: 0,
      soundVolume: 0,
      dialog: true,
      userAudio: true,
      userVideo: true,
      muteSpeaker: false
    }
  },
  components: {
    ParticipantComponent,
    InvitePeople,
    ConnectionDialogue
  },
  methods: {
    increaseSeekBar () {
      document.getElementById('redseekBar').style.width = `${this.redSeekBarWidth++}px`
    }
  },
  watch: {
    soundVolume: function () {
      this.soundVolume === 0 ? this.muteSpeaker = true : this.muteSpeaker = false
    }
  }
}
</script>

<style scoped lang="sass">
.curved-dark-shadow
  -webkit-box-shadow: -5px 4px 5px 0px rgba(0,0,0,0.75)
  -moz-box-shadow: -5px 4px 5px 0px rgba(0,0,0,0.75)
  box-shadow: -5px 4px 5px 0px rgba(0,0,0,0.75)
  -webkit-border-radius: 12px
  -moz-border-radius: 12px
  border-radius: 12px
.adjusted-height
  height: calc(100vh - 3rem)
.main-height
  height: 90%
.control-height
  height: 10%
.sidebar-width
  width: 20%
  overflow: scroll
  flex-wrap: nowrap !important
.co-browser
  width: 80%
.circle-image
  height: 35%
  width: 70%
  border-radius: 50% 50%
.volume-control
  width: 100%
</style>
