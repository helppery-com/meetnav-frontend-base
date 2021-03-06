<template>
<q-page class="full-width column adjusted-height justify-between items-center overflow-hidden" style="display: flex">
  <!-- the connection dialogue -->
  <connection-dialogue @continue="initMeeting"></connection-dialogue>
  <!-- main layout -->
  <div class="main-height full-width" style="display: flex">
    <!--  sidebar  -->
    <div class=" xs-hide sidebar-width full-height curved-dark-shadow q-mr-sm ">
    <!--   meeting participants   -->
      <div class="full-width full-height items-center justify-start" style="display: flex; flex-direction: column; overflow-y: auto">
        <participant-component v-bind:show-icons="showIcons" v-bind:is-notification="isNotification" ></participant-component>
        <participant-component v-bind:show-icons="showIcons" v-bind:is-notification="isNotification" ></participant-component>
        <participant-component v-bind:show-icons="showIcons" v-bind:is-notification="isNotification" ></participant-component>
        <participant-component v-bind:show-icons="showIcons" v-bind:is-notification="isNotification" ></participant-component>
        <participant-component v-bind:show-icons="showIcons" v-bind:is-notification="isNotification" ></participant-component>
        <participant-component v-bind:show-icons="showIcons" v-bind:is-notification="isNotification" ></participant-component>
      </div>
    </div>
      <!--  browse share  -->
    <div class="co-browser curved-dark-shadow full-height" style="position: relative">
      <invite-people></invite-people>
        <!--  Add Container    -->
      <div v-if="this.currentAdd"
           class="absolute flex items-center justify-end column full-width "
           style="bottom: 0; height: 170px;">
        <div class="ads bg-yellow q-mb-sm">
          <q-img
            v-bind:src="addContent"
            style="width: 100%; height: 100%; object-fit: contain"
          ></q-img>
          <div class="close bg-white flex items-center justify-center cursor-pointer" @click="closeAds">
            <q-icon name="close" size="20px"></q-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
    <!-- mobile view participant -->
  <div class=" items-center  sm-hide md-hide lg-hide mobile-participant xl-hide" style="display: flex; width: 100%; overflow-x: auto">
    <div style="width: 120px;height: 120px;">
    <participant-component v-bind:show-icons="showIcons" v-bind:is-notification="isNotification" ></participant-component>
    </div>
    <div style="width: 120px;height: 120px;">
      <participant-component v-bind:show-icons="showIcons" v-bind:is-notification="isNotification" ></participant-component>
    </div>
    <div style="width: 120px;height: 120px;">
      <participant-component v-bind:show-icons="showIcons" v-bind:is-notification="isNotification" ></participant-component>
    </div>
    <div style="width: 120px;height: 120px;">
      <participant-component v-bind:show-icons="showIcons" v-bind:is-notification="isNotification" ></participant-component>
    </div>
    <div style="width: 120px;height: 120px;">
      <participant-component v-bind:show-icons="showIcons" v-bind:is-notification="isNotification" ></participant-component>
    </div>
  </div>
  <!-- control layout -->
  <div class="control-height flex column justify-start full-width bg-black">
  <!--  seekbar  -->
    <div class="full-width bg-grey" style="height: 5px; position: relative">
      <!--  red seekbar    -->
      <div class="full-height bg-red" style="top: 0; z-index: 3; position: absolute" id="redseekBar"></div>
      <!--  ADS markers    -->
      <div class="full-height bg-yellow addMarker" style="left: 25%"></div>
      <div class="full-height bg-yellow addMarker" style="left: 50%"></div>
      <div class="full-height bg-yellow addMarker" style="left: 75%"></div>

    </div>
    <!--  controls  -->
    <div class="row full-width" style="height: calc( 100% - 5px)">
      <div class="col-6 row xs-hide sm-hide items-baseline justify-start">
        <div class="col-2 flex column full-height justify-center">
          <q-icon name="volume_up" size="50px" v-if="muteSpeaker" style="color: white" @mouseover="showMobileSlider" @mouseleave="showMobileSlider"></q-icon>
          <q-icon name="volume_off" v-if="!muteSpeaker" size="50px" style="color: white" @mouseover="showMobileSlider" @mouseleave="showMobileSlider"></q-icon>
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
        <div class="col-6 flex column  full-height items-center justify-start">
        <span class="text-h6 text-white" id="timer-count" style="transform: translateY(-20px)"></span>
        </div>
      </div>
      <div class="col-2  row md-hide lg-hide xl-hide  items-baseline justify-start">
        <div class="col-2 flex column full-height justify-center" style="position: relative">
          <q-icon name="volume_up" size="50px" v-if="muteSpeaker" style="color: white" @mouseover="showMobileSlider" @mouseleave="showMobileSlider"></q-icon>
          <q-icon name="volume_off" v-if="!muteSpeaker" size="50px" style="color: white" @mouseover="showMobileSlider" @mouseleave="showMobileSlider"></q-icon>
          <div v-if="mobileSpeakerSlider" class="absolute flex justify-end items-center column bg-black mobile-volume-slider">
            <q-slider
              v-model="soundVolume"
              :step="1"
              color="white"
              vertical
              reverse
              class="q-mb-sm q-mt-sm"
            />
          </div>
        </div>
      </div>
      <div class="col-xs-6 col-sm-6 col-md-2 col-lg-2 col-xl-2">
        <div class="full-width full-height row items-center justify-center">
          <q-btn round color="pink-5" v-if="userVideo" @click="toggleUserVideo" class="q-mr-xs" size="20px" icon="videocam" />
          <q-btn round color="pink-5" v-if="!userVideo" @click="toggleUserVideo"  class="q-mr-xs" size="20px" icon="videocam_off" />
          <q-btn round color="pink-5" class="q-ml-xs" v-if="userAudio" size="20px" @click="toggleUserAudio" icon="mic" />
          <q-btn round color="pink-5" class="q-ml-xs" v-if="!userAudio" size="20px" @click="toggleUserAudio" icon="mic_off" />
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
import Timer from 'easytimer.js'

export default {
  name: 'cobrowse',
  data () {
    return {
      // shows the time lapsed
      redSeekBarWidth: 0,
      // displayed sound level
      soundVolume: 0,
      // user mic
      userAudio: true,
      // user video
      userVideo: true,
      // user speaker muted
      muteSpeaker: false,
      makeResponsive: true,
      showIcons: true,
      isNotification: true,
      // add stack
      addStack: ['https://images.unsplash.com/photo-1495783436593-3015f0bc6f56?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1542586484-1ba19fe1ad53?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1569961384048-0001b31bb6f7?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
      // control the display of ads
      currentAdd: false,
      // the ads content being displayed
      addContent: '',
      // reference of the setUpInterval
      counterRef: null,
      // controls the display of user volume slider in mobile view
      mobileSpeakerSlider: false,
      secondHolder: 0,
      easyTimer: null
    }
  },
  components: {
    ParticipantComponent,
    InvitePeople,
    ConnectionDialogue
  },
  mounted () {
    this.easyTimer = new Timer()
    console.log(this.easyTimer)
  },
  methods: {
    increaseSeekBar () {
      this.redSeekBarWidth += 0.01
      const seekBar = document.getElementById('redseekBar')
      seekBar.style.width = `${this.redSeekBarWidth}%`
      const width = parseInt(seekBar.style.width[0] + seekBar.style.width[1])
      if (width === 26) {
        this.addContent = this.addStack.pop()
        this.currentAdd = true
      }
      if (width === 52) {
        this.addContent = this.addStack.pop()
        this.currentAdd = true
      }
      if (width === 76) {
        this.addContent = this.addStack.pop()
        this.currentAdd = true
      }
      if (width > 100) {
        clearInterval(this.counterRef)
      }
    },
    closeAds () {
      this.currentAdd = false
    },
    initMeeting () {
      this.easyTimer.start({ precision: 'seconds', startValues: { seconds: 0 }, target: { hours: 3600 } })
      this.easyTimer.addEventListener('secondsUpdated', this.incrementTime)
    },
    incrementTime (e) {
      document.getElementById('timer-count').innerHTML = this.easyTimer.getTimeValues().toString() + '/ 01:00:00'
      this.increaseSeekBar()
    },
    showMobileSlider () {
      this.mobileSpeakerSlider = !this.mobileSpeakerSlider
    },
    toggleUserVideo () {
      this.userVideo = !this.userVideo
    },
    toggleUserAudio () {
      this.userAudio = !this.userAudio
    }
  },
  watch: {
    soundVolume: function (newValue) {
      if (newValue === 0) {
        this.muteSpeaker = false
      } else {
        this.muteSpeaker = true
      }
    }
  }
}
</script>

<style scoped lang="sass">
.addMarker
  z-index: 10
  width: 20px
  top:0
  position: absolute
.mobile-volume-slider
  width: 50px
  height: 180px
  bottom: 80%
  left: 50%
  z-index: 30
.ads
  width: 500px
  height: 150px
  position: relative
.close
  position: absolute
  top: 0
  right: 0
  width: 30px
  height: 30px
  .mobile-participant
    height: 25%
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
.co-browser
  width: 80%
.volume-control
  width: 100%
@media screen and (max-width: 1023px)

@media screen and (max-width: 600px)
  .co-browser
   width: 100% !important
  .adjusted-height
    height: calc(100vh + 200px)
  .main-height
    height: 70%
  .ads
   width: 250px
   height: 100px
   position: relative
@media screen and (max-width: 500px)
  .main-height
    height: 70%
  .sidebar-width
    width: 25%
  .co-browser
   width: 75%
</style>
