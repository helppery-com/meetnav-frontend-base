<template>
  <q-card
    class="chat-popup column"
    style="width: 400px; height: 400px"
  >
    <q-card-section class="col">
      <NekoChat class="rounded-corners bg-blak bg-blue-grey-10"/>
    </q-card-section>
    <q-card-actions class="col-auto" align="right">
      <q-btn :label="$t('Close')" color="red" v-close-popup />
    </q-card-actions>
  </q-card>
</template>
<script>
import NekoChat from './neko/NekoChat.vue'
export default {
  components: {
    NekoChat
  }
}
</script>
