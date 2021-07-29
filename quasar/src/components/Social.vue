<template>
  <q-card
      class="chat-popup column"
      style="width: 400px; height: 400px"
    >
      <q-card-section class="col">
        <div class="social">
          <div class="text-bold q-mb-md text-h6 btn" @click="shareBy('copy')">
            <icon name="copy" scale="1.5" @click="shareBy('copy')" class="q-mr-md"/>
            {{ url }}
            <q-tooltip>
              {{ $t('Copy to clipboard') }}
            </q-tooltip>
          </div>
          <div class="row full-width justify-center">
            <div class="col">
            <img src="/gmail.png" class="btn" width="32px" @click="gmail()"/>
              <q-tooltip>
                {{ $t('Send by gmail') }}
              </q-tooltip>
            </div>
            <div class="col">
              <email :url="url" :title="title" scale="1.5" @click="shareBy('google')"/>
              <q-tooltip>
                {{ $t('Send by email') }}
              </q-tooltip>
            </div>
            <div class="col">
              <facebook :url="url" :title="title" scale="1.5"/>
              <q-tooltip>
                {{ $t('Post on facebook') }}
              </q-tooltip>
            </div>
            <div class="col">
              <twitter :url="url" :title="title"  scale="1.5" @click="shareBy('twitter')"/>
              <q-tooltip>
                {{ $t('Post on twitter') }}
              </q-tooltip>
            </div>
            <div class="col">
              <linkedin :url="url" :title="title" scale="1.5" @click="shareBy('linkedin')"/>
              <q-tooltip>
                {{ $t('Post on linkedin') }}
              </q-tooltip>
            </div>
            <div class="col">
              <whats-app :url="url" :title="title"  scale="1.5" @click="shareBy('whatsapp')"/>
              <q-tooltip>
                {{ $t('Send by whatsapp') }}
              </q-tooltip>
            </div>
            <div class="col">
              <telegram :url="url" :title="title" scale="1.5" @click="shareBy('google')"/>
              <q-tooltip>
                {{ $t('Send by telegram') }}
              </q-tooltip>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="col-auto" align="right">
        <q-btn :label="$t('Close')" color="red" v-close-popup />
    </q-card-actions>
  </q-card>
</template>
<script>
import { copyToClipboard } from 'quasar'
import 'vue-awesome/icons'

import {
  Facebook,
  Twitter,
  Linkedin,
  Telegram,
  WhatsApp,
  Email
} from 'vue-socialmedia-share'
import Icon from 'vue-awesome/components/Icon.vue'

export default {
  components: {
    Facebook,
    Twitter,
    Linkedin,
    Telegram,
    WhatsApp,
    Email,
    Icon
  },
  props: ['url'],
  data: function () {
    return {
      title: this.$t('Join me and let\'s navigate internet together!')
    }
  },
  methods: {
    shareBy (network) {
      console.log('Sharing on ', network)
      this.$emit('shareBy', network)
      if (network === 'copy') {
        copyToClipboard(this.url)
      }
    },
    gmail () {
      const subject = encodeURIComponent(this.$t('Join me at meetnav'))
      const body = encodeURIComponent(this.$t('Hey, use link below to join me at meetnav\n\n{url}', { url: this.url }))
      const url = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=${subject}&body=${body}&ui=2&tf=1&pli=1`
      window.open(url)
    }
  }
}
</script>
<style lang="sass">
  .social
    .fa-icon
      cursor: pointer
</style>
