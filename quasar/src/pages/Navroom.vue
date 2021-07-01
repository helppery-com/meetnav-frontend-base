<template>
  <q-page class="navroom-page column">
    <GuestLogin v-if="!user" />
    <div class="col row" v-if="termsAccepted">
      <div
        :class="['users relative-position column', `col-${chatCol}`]"
        v-if="$storex.room.showChat"
      >
        <div class="col column relative-position">
          <q-scroll-area class="col fit chat" v-if="connected">
            <div class="q-pa-sm fit">
              <NekoChat />
            </div>
          </q-scroll-area>
        </div>
      </div>
      <div class="col column">
        <NekoVideo :class="['col rounded-borders q-py-md q-px-xs']" @connected="ref => nekoVideoRef = ref" v-if="connected" />
        <div class="col-auto row q-pb-md">
          <VideoControls class="col-auto video-controls" v-if="connected"/>
        </div>
      </div>
      <div
        :class="['users relative-position column', `col-${userVideoCol}`]">
        <q-card :class="['col column', ix ? 'q-mt-xs' : '']" v-for="(camera, ix) in cameras" :key="ix">
          <UserVideo
              class="col"
              :stream="camera"
              :showUserInfo="true"
            />
        </q-card>
        <div class="col-auto column q-py-xs">
          <q-card class="col-auto q-pa-xs" v-for="(offlineUser, ix) in offlineUsers" :key="ix">
            <q-card-section class="row q-pa-xs ">
              <q-avatar class="col-auto">
                <img :src="offlineUser.avatar" />
              </q-avatar>
              <div class="col column q-ml-md">
                <div class="col text-h6">{{ $t('Offline') }}</div>
                <div class="col">{{ offlineUser.username }}</div>
              </div>
              <div class="col-auto row q-gutter-xs">
                <q-btn color="accent" :class="['col', callingOfflineUser ? 'pulse' : '']" icon="call" @click="callOfflineUser(offlineUser)" />
                <q-btn color="primary" class="col" icon="send" @click="openSendDlg(offlineUser)" />
                <q-dialog v-model="openSend" persistent>
                  <q-card style="min-width: 350px">
                    <q-card-section>
                      <div class="text-h6" v-if="offlineUserSendMessage">{{ `${$t('Write your message for')} @${offlineUserSendMessage.username}`}}</div>
                    </q-card-section>

                    <q-card-section class="q-pt-none">
                      <q-input dense v-model="offlineUserMessage" autofocus @keyup.enter="prompt = false" />
                      <q-toggle
                        v-model="sendToChat"
                        color="pink"
                        icon="chat"
                        :label="$t('Send message to room\'s chat as well')"
                    />
                    </q-card-section>

                    <q-card-actions align="right" class="text-primary">
                      <q-btn flat color="accent" :label="$t('Send')" v-close-popup @click="sendOfflineUserMessage"/>
                      <q-btn :label="$t('Cancel')" color="red" v-close-popup />
                    </q-card-actions>
                  </q-card>
                </q-dialog>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <q-dialog
    v-model="videoConferencePermissions">
     <q-card>
      <q-card-section>
        <div class="text-h6">{{this.$t('coBrowsePage.permission')}}</div>
        <p
         class="text-subtitle2">{{this.$t('coBrowsePage.allowPermission')}}</p>
         <ul class="text-subtitle2">
           <li> <a href="https://support.google.com/chrome/answer/2693767?co=GENIE.Platform%3DDesktop&oco=1" target="_blank">Chrome</a></li>
           <li> <a href="https://support.mozilla.org/en-US/kb/how-manage-your-camera-and-microphone-permissions" target="_blank">Firefox</a></li>
           <li> <a href="https://support.apple.com/en-gb/guide/safari/ibrwe2159f50/mac" target="_blank">Safari</a></li>
           <li> <a href="https://www.windowscentral.com/how-manage-site-permissions-new-microsoft-edge" target="_blank">Edge</a></li>
           </ul>
      </q-card-section>
      <q-separator dark />
    </q-card>
    </q-dialog>
    <q-dialog
      v-model="welcome"
      transition-show="scale"
      transition-hide="scale"
      :persistent="!isAdmin"
    >
      <q-card class="bg-primary text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">
            {{ $t('Room is begin created') }}
          </div>
        </q-card-section>
        <q-card-section>
          <Commercial @end="lnk => commercialLink = lnk" />
        </q-card-section>
        <q-card-section class="bg-white">
          <a href="" target="_blank">
            {{ $t('By joining this room you accept terms and conditions.') }}
          </a>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal" v-if="connected && commercialLink">
          <q-btn outline color="primary" :label="$t('OK')" v-close-popup class="ref-navroom-ready" @click="termsAccepted = true" />
          <q-btn outline icon="fas fa-external-link-alt" color="accent" :label="$t('Visit sponsor')" @click="openCommercial" class="ref-navroom-sponsor-link" />
        </q-card-actions>
        <q-card-actions align="right" class="bg-white text-teal" v-else>
          <q-spinner-pie
            color="primary"
            size="2em"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import NekoVideo from '../components/neko/NekoVideo'
import Commercial from '../components/Commercial'
import UserVideo from '../components/UserVideo'
import VideoControls from '../components/VideoControls.vue'
import NekoChat from '../components/neko/NekoChat'
import GuestLogin from '../components/GuestLogin.vue'

import '../assets/styles/vendor/_emote.scss'

export default {
  components: {
    NekoVideo,
    Commercial,
    UserVideo,
    VideoControls,
    NekoChat,
    GuestLogin
  },
  data () {
    return {
      video: false,
      initRTC: false,
      nekoVideoRef: null,
      volume: 100,
      leave: false,
      welcome: false,
      rating: 0,
      commercialLink: null,
      userVideoCol: 3,
      chatCol: 2,
      myCam: null,
      guestCams: null,
      openChat: false,
      openSend: false,
      offlineUserSendMessage: null,
      offlineUserMessage: '',
      sendToChat: false,
      callingOfflineUser: null,
      termsAccepted: false
    }
  },
  computed: {
    myCamera () {
      const myCams = this.cameras.filter(c => c[0].extra.id === this.$storex.user.user.id)
      return myCams.length ? myCams[0] : null
    },
    guestCameras () {
      const cams = this.cameras.filter(c => c[0].extra.id !== this.$storex.user.user.id)
      return cams.length ? cams : null
    },
    cameras () {
      return Object.keys(this.users).map(k => this.users[k])
    },
    isDebug () {
      return this.$route.query.debug
    },
    connected () {
      return this.$storex.room.nekoConnected
    },
    roomId () {
      return this.$storex.room.roomId
    },
    password () {
      return this.$storex.room.password
    },
    videoWidth () {
      if (this.nekoVideoRef) {
        return this.nekoVideoRef.videoWidth + 'px'
      }
      return '100%'
    },
    userCount () {
      return Object.keys(this.users).length
    },
    users () {
      return this.isDebug ? this.debugUserStreams : this.$storex.room.streams
    },
    debugUserStreams () {
      let debug = this.isDebug
      const streams = this.$storex.room.streams
      const u = streams[Object.keys(streams)[0]][0]
      const res = {}
      while (debug--) {
        const stream = u.stream.clone()
        const mediaElement = document.createElement('video')
        mediaElement.srcObject = stream
        res['u' + debug] = [{
          ...u,
          mediaElement,
          stream
        }]
      }
      return res
    },
    anyUser () {
      return !this.incognito || this.cameras.length > 1
    },
    incognito () {
      return this.$storex.room.muted && this.$storex.room.paused
    },
    isAdmin () {
      return this.$storex.user.user && this.$storex.user.user.role.description === 'administrator'
    },
    onlineUsers () {
      return Object.keys(this.users).map(k => this.users[k][0].extra)
    },
    offlineUsers () {
      const onlineUserIds = this.onlineUsers.map(u => u.id)
      if (onlineUserIds.length === 0 || this.$storex.room.room === null) {
        return []
      }
      const users = this.$storex.room.room.users
      return users.filter(u => onlineUserIds.indexOf(u.id) === -1)
    },
    user () {
      return this.$storex.user.user
    }
  },
  watch: {
    roomId (newVal) {
      if (newVal && !this.$route.params.roomId) {
        this.$router.push(`/navroom/${this.roomId}`)
      }
    },
    connected () {
      console.log('Connected')
    },
    cameras () {
      this.myCam = this.myCamera
      this.guestCams = this.guestCameras
    }
  },
  async created () {
    await this.askForPermission()
    await this.checkUserPermissions()
  },
  methods: {
    roomEstablishment () {
      this.isRoomAlreadyEstablished = true
      this.welcome = true
      if (!this.$storex.user.user) {
        this.$root.$once('user-logged', () => this.openRoom())
      } else {
        this.openRoom()
      }
    },
    // ask user for permission
    async askForPermission () {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      } catch (e) {

      }
    },
    async updatingPermissionStates (permission, state) {
      switch (permission) {
        case 'granted': {
          this.$data[state] = true
          break
        }
        default: {
          this.$data[state] = false
        }
      }
    },
    // main method for checking user permission
    checkUserPermissions () {
      navigator.permissions.query({ name: 'microphone' }).then(permission => {
        this.updatingPermissionStates(permission.state, 'micPermission')
        console.log('init')
        permission.onchange = (perm) => {
          this.updatingPermissionStates(perm.srcElement.state, 'micPermission')
        }
      })
      navigator.permissions.query({ name: 'camera' }).then(permission => {
        this.updatingPermissionStates(permission.state, 'cameraPermission')
        permission.onchange = (perm) => {
          console.log(this.isRoomAlreadyEstablished)
          this.updatingPermissionStates(perm.srcElement.state, 'cameraPermission')
        }
      })
    },
    async openRoom () {
      this.welcome = true
      const { roomId, username } = this.$route.params
      const calling = this.$route.path.endsWith('/call')
      await this.$storex.room.openOrJoin({ ...this.$route.query, roomId, username, calling })
    },
    openCommercial () {
      window.open(this.commercialLink, '_blank')
    },
    userVideoHeight () {
      const { minHeight } = this.$el.style
      const height = parseInt(minHeight.replace('px', ''))
      const userCount = this.userCount
      return `${parseInt(height / userCount)}px`
    },
    openSendDlg (offlineUser) {
      this.openSend = true
      this.offlineUserSendMessage = offlineUser
    },
    sendOfflineUserMessage () {
      if (this.sendToChat) {
        this.$storex.room.sendChatMessage(`@${this.offlineUserSendMessage.username}: ${this.offlineUserMessage}`)
      }
    },
    callOfflineUser (offlineUser) {
      this.callingOfflineUser = offlineUser
      setTimeout(() => { this.callingOfflineUser = null }, 40000)
    }
  },
  beforeDestroy () {
    this.$storex.room.leave()
  }
}
</script>
<style lang="sass">
  body
    overflow: hidden
  .navroom-page
    .neko-video
      opacity: 0.9
    .footer
      height: 45px
    ul.video-menu.bottom,
    ul.video-menu.top
      display: none
    .player
      border-radius: 3px
    .members
      video
        border-radius: 5px
    .video-controls
      margin: auto
      border: 1px solid
      border-radius: 50px
      padding: 0px 3px 4px 0px
      background-color: #717a7e
    .emotes
      max-witdh: 100%
      max-height: 100%
      overflow: hidden
      margin-right: 10px
      -webkit-box-flex: 1
      -ms-flex: 1
      -webkit-box-pack: end
      -ms-flex-pack: end
      justify-content: flex-end
      -webkit-box-align: center
      -ms-flex-align: center
      align-items: center
      display: -webkit-box
      display: -ms-flexbox
      display: flex
      ul
        list-style: none
        padding-inline-start: 0
        margin-block-end: 0
        margin-block-start: 0
    .dish
      .camera
        border-radius: 5px

    .q-scrollarea
      .absolute.full-width
        height: 100% !important
    .neko-chat
      .neko-emoji
        width: 100% !important
      .message
        margin-top: 3px
        background-color: #ffffffe0 !important
        border-radius: 5px !important
</style>
