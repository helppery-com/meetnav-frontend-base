<template>
  <q-page>
    <q-dialog persistent v-model="show">
      <q-card class="consent">
        <q-card-section class="text-h3 row">
          <div class="col-auto">
            <img style="width:60px !important" src="/logo.png" />
          </div>
          <div class="col-auto">{{ $t('Welcome to meetnav!')}}</div>
        </q-card-section>
        <q-card-section>
          <div class="text-h6">{{ $t('Before you continue') }}</div>
          <div class="text-caption">{{ $t('Please be sure to read and consent') }}</div>
          <q-toggle
            v-model="terms"
          >
          </q-toggle>
          <a href="https://web.meetnav.com/privacy" target="_blank">{{ $t('(*) Terms and conditions') }}</a>
        </q-card-section>
        <q-card-section>
          <div class="text-caption">{{ $t('Cookies') }}</div>
          <div>
            <q-toggle
              v-model="cookies_basic"
            >
            </q-toggle>
            <a href="https://web.meetnav.com/privacy" target="_blank">{{ $t('(*) Basic cookies policy') }}</a>
          </div>
          <div>
            <q-toggle
              v-model="cookies_analytics"
            >
            </q-toggle>
            <a href="https://web.meetnav.com/privacy" target="_blank">{{ $t('Analytics cookies policy') }}</a>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="accent"
            icon="favorite"
            :label="$t('I consent')"
            :disable="!hasConsent"
            @click="consent"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import consentMng from 'src/consent'
export default {
  data () {
    return {
      show: true,
      cookies_basic: true,
      cookies_analytics: true,
      terms: true
    }
  },
  methods: {
    async consent () {
      await consentMng.setConsent(this.cookiesSettings)
      const { back } = this.$route.query
      setTimeout(() => this.$router.push(back), 100)
    }
  },
  computed: {
    hasConsent () {
      return this.terms && this.cookies_basic
    },
    cookiesSettings () {
      return {
        consent: this.hasConsent,
        analytics: this.cookies_analytics
      }
    }
  }
}
</script>
<style lang="sass">
  .consent
    img
      width: 500px !important
      margin: auto
</style>
