<template>
  <div ref="rtc"></div>
</template>
<script>
import RTCNavroom from '../assets/RTCMultiConnectionClient'
const client = new RTCNavroom({
  id: 10,
  username: 'user1'
})
export default {
  mounted () {
    client.onUserConnected = this.onUserConnected.bind(this)
    client.onGuestWaiting = this.onGuestWaiting.bind(this)
    client.connect()
  },
  methods: {
    onUserConnected (stream) {
      const video = stream.mediaElement
      this.$refs.rtc.appendChild(video)
    },
    onGuestWaiting (newParticipant) {
      const notif = this.$q.notify({
        message: '',
        actions: [
          {
            label: this.$t('accept'),
            color: 'accent',
            handler: () => {
              client.acceptUser(newParticipant.participantId)
              notif()
            }
          },
          {
            label: this.$t('reject'),
            color: 'red',
            handler: () => {
              client.rejectUser(newParticipant.participantId)
              notif()
            }
          }
        ]
      })
    }
  }
}
</script>
