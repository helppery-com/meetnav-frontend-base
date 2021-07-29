<template>
  <div class="navroom-users fit text-white">
    <div class="row top-left">
      <q-btn
        flat round
        :icon="room.cameraConnected ? 'fas fa-phone-slash' : 'duo'"
        color="white"
        :class="[
          room.cameraConnected ? 'bg-red' : 'bg-accent',
          'shadow-2',
          room.liveVideoChat && !room.cameraConnected ? 'bounce' : ''
          ]"
        @click="room.toggleVideoChat()"
      >
        <q-badge color="green"
          class="shadow-2"
          floating
          v-if="room.liveVideoChat && !room.cameraConnected">
          <q-spinner-radio
            color="white"
            size="10px"
          />
        </q-badge>
        <q-tooltip>
          <div v-if="room.liveVideoChat && !room.cameraConnected">{{ $t('Live video chat session is going on, click to join!') }}</div>
          <div v-else>{{ $t(room.cameraConnected ? 'Leave video chat' : 'Start video chat') }}</div>
        </q-tooltip>
      </q-btn>
    </div>
    <div class="row top-right">
      <q-btn flat round
        :icon="room.hasControl ? 'fas fa-mouse-pointer' : 'fas fa-mouse'"
        :color="room.hasControl ? 'white' : 'grey'"
        class="col-auto"
        @click="room.toggleControls()"
      >
        <q-tooltip>
          <div v-if="room.hasControl">{{ $t('You have the control. Click here to release it.')}}</div>
          <div v-else>{{ $t('You don\'t the control. Click here to take it.')}}</div>
        </q-tooltip>
      </q-btn>
      <q-btn flat round color="accent" class="bg-white shadow-2" icon="fas fa-question-circle" @click="toggleMode('support')">
        <q-tooltip>
          {{ $t('Click for help, suggestions or contact support.') }}
        </q-tooltip>
      </q-btn>
    </div>
    <div class="main-profile column q-pa-xs fit">
      <UserVideo
        class="col-6"
        :stream="room.userStream"
        v-if="room.cameraConnected"
        v-on:connecting="val => connecting = val"
        style="margin-bottom: -20px"
      />
      <div
        class="col row q-pa-xs justify-center"
        v-if="guestCamerasCount">
        <UserVideo
          :class="getColSize"
          v-for="(camera, key, ix) in guestCameras"
          :key="ix"
          :stream="camera"
        />
      </div>
      <div class="col-6 q-pb-md" style="margin: auto" v-if="!room.cameraConnected">
        <div class="q-mt-md col-auto column">
          <q-avatar class="col-auto q-pt-md" size="8vw" >
            <img :src="user.avatar" />
          </q-avatar>
          <div class="col row">
            <div
              class="q-pa-md"
              v-for="(member, key, ix) in room.users" :key="ix">
              <q-avatar class="col-auto q-pt-md" size="4vw" >
                <img :src="member.extra.avatar" />
                <q-badge floating v-if="member.extra.hasControl">
                  <q-icon name="fas fa-mouse-pointer" />
                </q-badge>
              </q-avatar>
            </div>
          </div>
          <q-btn flat
            :label="`#${room.roomId}`"
            class="col-auto text-h6 q-pt-md"
            style="margin: auto" @click="toggleMode('share')"
            icon-right="fas fa-paper-plane"
            size="md"
          />
        </div>
      </div>
      <div class="col ads-space q-mb-md relative-position" v-if="guestCamerasCount === 0">
        <img
          class="fit ads-space-bg"
          src="/images/st_available_ads.jpg"
        />
        <div class="ad-text fit">
          <a
            class="fit"
            href="/contact"
            target="blank"
          >
            <div class="text-h4">{{ $t('Space available for your advertising.') }}</div>
            <div class="text-h6">{{ $t('Click here!') }}</div>
          </a>
        </div>
      </div>
      <div class="col-ato q-pa-xs">
        <div class="col-auto row justify-between full-width q-px-xs">
          <q-btn
            flat round
            icon="fas fa-credit-card"
            class="col-auto" @click="toggleMode('wallet')"
            :disabled="false"
            v-if="false"
          >
              <q-badge color="green" floating>10 €</q-badge>
          </q-btn>
          <q-btn flat round icon="far fa-comment-dots" class="col-auto" @click="toggleMode('chat')">
            <q-badge floating v-if="newChatCount">
              {{ newChatCount }}
            </q-badge>
            <q-tooltip>
              {{ $t('Open chat') }}
            </q-tooltip>
          </q-btn>
          <q-btn flat round icon="fas fa-cog" class="col-auto" @click="toggleMode('settings')"  />
          <q-btn flat class="bg-red" round icon="fas fa-sign-out-alt" size="md" @click="toggleMode('leave')" />
        </div>
      </div>
    </div>
    <q-dialog
      v-model="showPopup"
      @hide="mode = ''"
    >
      <ChatPopup v-if="showChat"/>
      <OnlineUsers v-if="showUsers"/>
      <Wallet v-if="showWallet" />
      <LeaveRoom v-if="showLeaveRoom" />
      <VideoSettings v-if="showSettings" />
    </q-dialog>
  </div>
</template>
<script>
import UserVideo from '../components/UserVideo.vue'
import OnlineUsers from '../components/OnlineUsers'
import Wallet from '../components/Wallet'
import LeaveRoom from './LeaveRoom'
import VideoSettings from './VideoSettings'
import ChatPopup from './ChatPopup'

export default {
  components: {
    UserVideo,
    OnlineUsers,
    Wallet,
    LeaveRoom,
    VideoSettings,
    ChatPopup
  },
  data () {
    return {
      mode: '',
      connecting: true,
      showPopup: false,
      tout: null,
      toutMs: 1000,
      clock: null
    }
  },
  computed: {
    user () {
      return this.$storex.user.user
    },
    users () {
      return this.$storex.room.users
    },
    room () {
      return this.$storex.room
    },
    showChat () {
      return this.mode === 'chat'
    },
    showUsers () {
      return this.mode === 'users'
    },
    showWallet () {
      return this.mode === 'wallet'
    },
    showLeaveRoom () {
      return this.mode === 'leave'
    },
    showSettings () {
      return this.mode === 'settings'
    },
    guestCameras () {
      if (!this.room.cameraConnected) {
        return {}
      }
      const { debug } = this.$route.query
      if (debug) {
        const guest = [{
          ...this.room.userStream[0],
          type: 'debug'
        }]
        const cams = {}
        for (var c = 0; c < debug; ++c) {
          cams['cam-' + c] = guest
        }
        return cams
      }
      return this.$storex.room.guestStreams
    },
    guestCamerasCount () {
      return Object.keys(this.guestCameras).length
    },
    getColSize () {
      if (this.guestCamerasCount > 1) {
        return 'col-6'
      } else {
        return 'col'
      }
    },
    newChatCount () {
      const { chatMessages, lastMessageSeen } = this.room
      return chatMessages.filter(m => m.type === 'text' && m.created > lastMessageSeen).length
    }
  },
  methods: {
    toggleMode (mode) {
      if (this.mode !== mode) {
        this.mode = mode
        this.showPopup = true
      } else {
        this.mode = ''
      }
    },
    onTout () {
    }
  },
  mounted () {
    const { expiresAt } = this.room.room
    if (expiresAt) {
      this.tout = setInterval(this.onTout.bind(this), this.toutMs)
    }
  },
  destroyed () {
    clearInterval(this.tout)
  }
}
</script>
<style lang="sass">
  .navroom-users
    .main-profile
      border-radius: 5px
      background-image: linear-gradient(#5b7e96, #2a455d, #151c23)
    .top-left
      position: absolute
      left: 12px
      top: 10px
      z-index: 1000
    .top-right
      position: absolute
      right: 12px
      top: 10px
      z-index: 1000
  .ads-space
    .ads-space-bg
      background-size: contain
      background-repeat: no-repeat
      background-position: center
      position: absolute
      opacity: .6
      top: 0
      left: 0
      right: 0
      bottom: 0
    .ad-text
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      text-align: center
      padding: 10%
      display:block
      text-shadow: 2px 2px 1px #906326
      a
        color: white !important
</style>
