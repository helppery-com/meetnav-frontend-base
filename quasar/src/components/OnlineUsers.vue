<template>
  <div class="online-users fit">
    <div class="list">
      <div
        class="row bg-white text-dark q-pa-md rounded-borders"
        v-for="(user, key, ix) in users" :key="ix">
        <q-avatar class="col-auto">
          <img :src="user.extra.avatar" />
        </q-avatar>
        <div class="col">{{ `@${user.extra.username}` }}</div>
      </div>
    </div>
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
</template>
<script>
export default {
  computed: {
    users () {
      return this.$storex.room.rtc.users
    },
    offlineUsers () {
      return []
    }
  }
}
</script>
<style lang="sass">
  .online-users
    position: relative

    .list
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      overflow: auto
</style>
