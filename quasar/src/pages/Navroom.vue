<template>
  <q-page class="navroom-page column bg-black q-pa-md">
    <GuestLogin v-if="isRoomAlreadyEstablished && !user" />
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
        <NekoVideo :class="['col rounded-borders', fullScreen  ? '' : '']"
          @connected="ref => nekoVideoRef = ref" v-if="connected" />
      </div>
      <div
        :class="['users relative-position column q-ml-md', `col-${userVideoCol}`]"
      >
        <NavroomUsers class="rounded-borders"/>
      </div>
    </div>
    <q-dialog
    v-model="requestPermissionDlg">
     <q-card>
      <q-card-section>
        <div class="text-h6">{{ $t('coBrowsePage.permission') }}</div>
        <p
         class="text-subtitle2">{{ $t('coBrowsePage.allowPermission') }}</p>
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
      @hide="onTermsAndCondsAccepted"
    >
      <q-card class="bg-primary text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">
            {{ $t('Room is begin created') }}
          </div>
        </q-card-section>
        <q-card-section>
          <Commercial @end="lnk => commercialLink = lnk" style="opacity:0.6" />
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
        </q-card-section>
        <q-card-section class="bg-white">
          <a href="" target="_blank">
            {{ $t('By joining this room you accept terms and conditions.') }}
          </a>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal" v-if="connected && commercialLink">
          <q-btn outline color="primary" :label="$t('OK')" v-close-popup class="ref-navroom-ready" />
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
import NekoChat from '../components/neko/NekoChat'
import GuestLogin from '../components/GuestLogin.vue'
import NavroomUsers from '../components/NavroomUsers.vue'

import '../assets/styles/vendor/_emote.scss'

export default {
  components: {
    NekoVideo,
    Commercial,
    NekoChat,
    GuestLogin,
    NavroomUsers
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
      chatCol: 2,
      openChat: false,
      openSend: false,
      offlineUserSendMessage: null,
      offlineUserMessage: '',
      sendToChat: false,
      callingOfflineUser: null,
      termsAccepted: false,
      permisssionDialog: null,
      cameraPermission: false,
      micPermission: false,
      isRoomAlreadyEstablished: false,
      requestPermissionDlg: false
    }
  },
  computed: {
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
    users () {
      return this.isDebug ? this.debugUserStreams : this.$storex.room.streams
    },
    isDebug () {
      return this.$route.query.debug
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
    incognito () {
      return this.$storex.room.incognito
    },
    isAdmin () {
      return this.$storex.user.user && this.$storex.user.user.role.description === 'administrator'
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
    },
    fullScreen () {
      return this.$storex.room.fullScreen
    },
    userVideoCol () {
      return 3
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
    }
  },
  async created () {
    await this.checkUserPermissions()
    this.$root.$once('user-login-cancel', () => this.redirectToError())
  },
  methods: {
    roomEstablishment () {
      this.isRoomAlreadyEstablished = true
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
    updatingPermissionStates (permission, state) {
      switch (permission) {
        case 'granted': {
          this.$data[state] = true
          break
        }
        default: {
          this.$data[state] = false
        }
      }
      if (this.cameraPermission && this.micPermission) {
        this.requestPermissionDlg = false
        this.roomEstablishment()
      }
    },
    // main method for checking user permission
    async checkUserPermissions () {
      await this.askForPermission()
      const micPermission = navigator.permissions.query({ name: 'microphone' })
        .then(permission => {
          this.updatingPermissionStates(permission.state, 'micPermission')
          permission.onchange = (perm) => {
            this.updatingPermissionStates(perm.srcElement.state, 'micPermission')
          }
        })
      const cameraPermission = navigator.permissions.query({ name: 'camera' })
        .then(permission => {
          this.updatingPermissionStates(permission.state, 'cameraPermission')
          permission.onchange = (perm) => {
            this.updatingPermissionStates(perm.srcElement.state, 'cameraPermission')
          }
        })
      await Promise.all([micPermission, cameraPermission])
      this.requestPermissionDlg = !this.micPermission || !this.cameraPermission
    },
    async openRoom () {
      try {
        this.welcome = true
        const { roomId, username } = this.$route.params
        const calling = this.$route.path.endsWith('/call')
        const settings = { ...this.$route.query, roomId, username, calling }
        await this.$storex.room.openOrJoin(settings)
        if (settings.fullScreen) {
          this.$storex.room.setFullScreen(true)
        }
      } catch (ex) {
        console.error(ex)
        this.redirectToError()
      }
    },
    redirectToError () {
      const errorUrl = 'https://web.meetnav.com/error'
      window.location.href = this.$route.query.errorUrl || errorUrl
    },
    openCommercial () {
      window.open(this.commercialLink, '_blank')
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
    },
    onTermsAndCondsAccepted () {
      this.termsAccepted = true
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
        background-color: #607d8b !important
        border-radius: 5px !important
        .timestamp,
        .content-body
          color: white !important
      .chat-history
        height: 250px !important
        flex: none !important

    .controls.fullScreen
        position: absolute
        bottom: -42px
        width: 100%
        &:hover
          -webkit-animation: appearEffect 1s forwards
          -moz-animation: appearEffect 1s forwards
          -ms-animation: appearEffect 1s forwards
          -o-animation: appearEffect 1s forwards
          animation: appearEffect 1s forwards
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
  @keyframes appearEffect
    from
      bottom: -42px
    to
      bottom: 5px

  /* Firefox < 16 */
  @-moz-keyframes appearEffect
    from
      bottom: -42px
    to
      bottom: 5px

  /* Safari, Chrome and Opera > 12.1 */
  @-webkit-keyframes appearEffect
    from
      bottom: -42px
    to
      bottom: 5px

  /* Internet Explorer */
  @-ms-keyframes appearEffect
    from
      bottom: -42px
    to
      bottom: 5px
</style>
