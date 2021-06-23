<template>
  <div>
    <div v-if="cameraTest">
      <q-card class="my-card">
        <q-card-section>
          <div class="text-h6">
          {{ $t('Camera test') }}
        </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <UserVideo :stream="[cameraStream]" v-if="cameraStream" />
          <q-spinner-ball
            color="primary"
            size="2em"
            v-else
          />
        </q-card-section>
        <q-card-actions vertical>
          <q-btn flat v-close-popup :label="$t('Close')" />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>
<script>
import NavRoom from '../assets/RTCMultiConnectionClient'
import UserVideo from '../components/UserVideo'

export default {
  components: {
    UserVideo
  },
  data () {
    return {
      rtc: null,
      cameraTest: null,
      cameraStream: null
    }
  },
  computed: {
  },
  mounted () {
    if (this.$route.query.mode === 'camera') {
      this.testCamera()
    }
  },
  destroyed () {
    if (this.rtc) {
      this.rtc.leave()
    }
  },
  methods: {
    testCamera () {
      this.cameraTest = 'testing'
      this.rtc = new NavRoom({ id: 0, username: this.$t('Guest') })
      this.rtc.onUserConnected = stream => {
        this.cameraStream = stream
      }
      this.rtc.connect(`${new Date().getTime()}`)
    }
  }
}
</script>
