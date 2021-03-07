<template>
  <q-page class="full-width column adjusted-height justify-between items-center overflow-hidden" style="display: flex">
    <!-- the connection dialogue -->
    <connection-dialogue @continue="initMeeting"></connection-dialogue>
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
    <!-- main layout -->
    <div class="main-height full-width" style="display: flex">
      <!--  sidebar  -->
      <div class=" xs-hide sidebar-width full-height curved-dark-shadow q-mr-sm ">
        <!--   meeting participants   -->
        <div class="full-width full-height items-center justify-start" style="display: flex; flex-direction: column; overflow-y: auto">
          <participant-component v-bind:show-icons="showIcons" v-bind:is-notification="isNotification" ></participant-component>
          <participant-component v-bind:show-icons="showIcons" v-bind:is-notification="isNotification" ></participant-component>
        </div>
      </div>
      <!--  browse share  -->
      <div class="co-browser curved-dark-shadow full-height" style="position: relative">
        <invite-people></invite-people>
        <!--  Add Container    -->
      <adds-component v-bind:add-content="addContent" v-if="currentAdd" @CloseAds = "closeAds"></adds-component>
      </div>
    </div>
    <!-- control layout -->
    <div class="control-height flex column justify-start full-width bg-black">
      <!--  seekbar  -->
      <seek-bar></seek-bar>
      <!--  controls  -->
      <div class="row full-width justify-between items-center" style="height: calc( 100% - 5px); position: relative">
        <div class="full-height flex row justify-between items-center" style="width: fit-content">
          <!--     volume controls     -->
          <div class="full-height flex items-center" style="position: relative;width: fit-content">
            <q-icon name="volume_up" size="50px"  v-if="muteSpeaker" style="color: white" @click="showMobileSlider"></q-icon>
            <q-icon name="volume_off" v-if="!muteSpeaker" size="50px" style="color: white" @click="showMobileSlider"></q-icon>
            <div class="bg-black flex justify-center mobile-volume-slider" v-if="mobileSpeakerSlider">

              <div class="full-width full-height q-pt-sm" style="position:relative;">
                <div class="full-width full-height flex justify-center items-center" style="position:absolute; z-index: 3">
                <q-slider
                  v-model="soundVolume"
                  :step="1"
                  color="white"
                  vertical
                  reverse
                />
                </div>
                <div class="full-height full-width flex justify-center items-center" style="position:absolute; z-index: 1">
                  <div class="bg-white" style="height: 100%; width: 2px"></div>
                </div>
              </div>

            </div>
          </div>
          <div class="q-ml-md " style="width: 100px; position: relative">
            <div class="slider">
                <q-slider
                  v-model="soundVolume"
                  :step="1"
                  class="text-white"
                  label-color="text-white"
                />
            </div>
           <div class=" flex justify-center slider-line">
             <div class="bg-white" style="width: 100%; height: 2px"></div>
           </div>
          </div>
          <span class="text-h6 q-ml-md text-white" id="timer-count" ></span>
        </div>
        <div class="full-height flex items-center justify-between audio-video-controls">
          <user-audio-video></user-audio-video>
        </div>
        <div class="full-height flex row items-center justify-between" style="width: fit-content">
            <settings-keyboard-fullscreen></settings-keyboard-fullscreen>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import ParticipantComponent from 'components/ParticipantComponent'
import InvitePeople from 'components/InvitePeople'
import ConnectionDialogue from 'components/ConnectionDialogue'
import UserAudioVideo from 'components/UserAudioVideo'
import AddsComponent from 'components/AddsComponent'
import SettingsKeyboardFullscreen from 'components/SettingsKeyboardFullscreen'
import SeekBar from 'components/SeekBar'
import Timer from 'easytimer.js'
export default {
  name: 'cobrowse',
  data () {
    return {
      // shows the time lapsed
      redSeekBarWidth: 0,
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
      secondHolder: 0,
      easyTimer: null,
      // user speaker muted
      muteSpeaker: false,
      // controls the display of user volume slider in mobile view
      mobileSpeakerSlider: false,
      // displayed sound level
      soundVolume: 0
    }
  },
  components: {
    ParticipantComponent,
    InvitePeople,
    ConnectionDialogue,
    UserAudioVideo,
    AddsComponent,
    SettingsKeyboardFullscreen,
    SeekBar
  },
  mounted () {
    this.easyTimer = new Timer()
  },
  methods: {
    increaseSeekBar () {
      this.redSeekBarWidth += 0.6
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
    },
    closeAds () {
      this.currentAdd = false
    },
    initMeeting () {
      this.easyTimer.start({ precision: 'seconds', startValues: { seconds: 0 }, target: { seconds: 3600 } })
      this.easyTimer.addEventListener('secondsUpdated', this.incrementTime)
    },
    incrementTime (e) {
      document.getElementById('timer-count').innerHTML = this.easyTimer.getTimeValues().toString() + '/ 01:00:00'
      this.increaseSeekBar()
    },
    showMobileSlider () {
      this.mobileSpeakerSlider = !this.mobileSpeakerSlider
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
.mobile-volume-slider
  display: none
.audio-video-controls
  width: fit-content
  position: absolute
  left: calc(50% - 100px)
  right: calc(50% - 100px)
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
  width: 100px
.slider
  position: absolute
  z-index: 3
  width: 100%
  height: 100%
  display: flex
  align-items: center
  justify-content: center
.slider-line
  position: absolute
  z-index: 1
  width: 100%
  height: 100%
@media screen and (max-width: 980px)
  #timer-count
    display: none
@media screen and (max-width: 615px)
  .mobile-volume-slider
    display: flex
    width: 100%
    height: 180px
    position: absolute
    bottom: 100%
    left: 50%
    z-index: 8
  .co-browser
    width: 100% !important
  .adjusted-height
    height: calc(100vh + 200px)
  .slider
    display: none
  .slider-line
    display: none
  .main-height
    height: 80%
@media screen and (max-width: 500px)
  .sidebar-width
    width: 25%
  .co-browser
    width: 75%
</style>
