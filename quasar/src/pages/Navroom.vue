<template>
  <q-page class="navroom-page row">
    <div :class="['q-pa-xs users relative-position column', `col-${userVideoCol}`]">
      <div class="col-auto" style="display:none">
        <q-btn icon="fas fa-search-minus" @click="userVideoCol = Math.max(1, userVideoCol - 1)" />
        <q-btn icon="fas fa-search-plus"  @click="userVideoCol = Math.min(6, userVideoCol + 1)"/>
      </div>
      <div class="col relative-position">
        <Dish
          class="fit q-pt-xs col"
          :cameras="cameras"
          :colSize="userVideoCol"
        >
          <template v-slot:camera="{ camera }">
            <UserVideo
              :stream="camera"
              :showUserInfo="true"
            />
          </template>
        </Dish>
      </div>
    </div>
    <div class="col q-pa-xs">
      <NekoVideo class="rounded-borders" @connected="ref => nekoVideoRef = ref" v-if="connected" />
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
      persistent>
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
import UserVideo from '../components/UserVideo'
import Dish from '../components/Dish'
import '../assets/styles/vendor/_emote.scss'

export default {
  components: {
    NekoVideo,
    Commercial,
    UserVideo,
    Dish
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
      permisssionDialog: null,
      cameraPermission: false,
      micPermission: false,
      isRoomAlreadyEstablished: false
    }
  },
  computed: {
    cameras () {
      const users = this.users
      return Object.keys(users).map(k => users[k])
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
    videoConferencePermissions () {
      const condition = this.cameraPermission === false || this.micPermission === false
      if (!condition && !this.isRoomAlreadyEstablished) {
        this.roomEstablishment()
      }
      return condition
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
</style>
