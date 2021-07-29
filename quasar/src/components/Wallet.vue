<template>
  <q-card class="wallet column text-dark">
    <q-card-section>
      <div class="col-auto text-h5">{{ $t('Your cashback wallet')}}</div>
      <div class="col-4 q-py-md">
        <q-card class="bg-dark text-white relative-position shadow-5">
          <div class="card-credit text-yellow-9 q-pa-md">
            <div class="text-h2">{{ `${current} ${currency}` }}</div>
            <q-separator />
            <span class="text-subtitle">{{ $t('Welcome credit!') }}</span>
          </div>
          <q-card-section class="row justify-between">
            <div class="col-auto text-h5">meetnav-card</div>
            <q-icon outline name="fas fa-fingerprint" size="xl" style="color: goldenrod;"/>
          </q-card-section>
          <q-card-section>
            <div class="col text-subtitle2">{{ wallet.atname }}</div>
            <div class="col text-subtitle2">XXX-XXX-XXXX-XXXX</div>
            <div class="col text-subtitle2">Expires XX /XX</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-auto">
        <div class="text-subtitle1 q-py-xs text-weight-bolder">
          {{ $t('Pay safely with your meetnav cashback card!') }}
          <br/>
          <a href="/contact" target="blank">{{ $t('learn more...') }}</a>
        </div>
        <div class="row">
          <q-input
            filled
            v-model="recharge"
            :label="$t('Recharge with...')"
            class="col-4"
          />
          <q-btn flat
            :class="['col', payment.color]"
            size="md"
            v-for="(payment, ix) in payments"
            :key="ix"
            :icon="payment.icon" @click="payWith(payment)"
          >
            <q-tooltip>
              {{ $t('Safe payment on any web site with Wallet! (only availabe for subscriptor)') }}
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card-section>
    <q-card-actions class="col-auto" align="right">
      <q-btn :label="$t('Enable Card')" color="blue" disabled />
      <q-btn :label="$t('Close')" color="red" v-close-popup />
    </q-card-actions>
  </q-card>
</template>
<script>
export default {
  data () {
    return {
      current: 10,
      recharge: 100,
      currency: '€',
      payments: [{
        icon: 'far fa-credit-card',
        color: 'text-black'
      }, {
        icon: 'fab fa-cc-amazon-pay',
        color: 'text-orange'
      }, {
        icon: 'fab fa-cc-paypal',
        color: 'text-blue'
      }, {
        icon: 'fab fa-bitcoin',
        color: 'text-orange'
      }]
    }
  },
  computed: {
    wallet () {
      return this.$storex.user
    }
  }
}
</script>
<style lang="sass">
  .wallet
    .card-credit
      position: absolute
      right: 0
      bottom: 0
      text-align: end
</style>
