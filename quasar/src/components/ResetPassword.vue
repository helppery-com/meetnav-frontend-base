<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <div class="text-h3">{{ $t('Reset password') }}</div>
    </q-card-section>
    <q-card-section v-if="resetAsked">
      <div>{{ $t('We will send a reset code to your email.') }}</div>
      <div class="text-subtitle"><i>{{ $t('Please check spam folder as well.') }}</i></div>
      <q-input
        type="email"
        :label="$t('Email')"
        v-model="email"
      >
        <template v-slot:append>
          <q-icon name="email" />
        </template>
      </q-input>
    </q-card-section>
    <q-card-section v-else>
      <q-input
        :type="pwdVisible ? 'text' : 'password'"
        :label="$t('Password')"
        v-model="password"
      >
        <template v-slot:append>
          <q-btn flat round :icon="pwdVisible ? 'lock' : 'visibility'" @click="pwdVisible = !pwdVisible" />
        </template>
      </q-input>
      <q-input
        :type="resetpwdVisible ? 'text' : 'password'"
        :label="$t('Repeat password')"
        v-model="repeatPassword"
      >
        <template v-slot:append>
          <q-btn flat round :icon="resetpwdVisible ? 'lock' : 'visibility'" @click="resetpwdVisible = !resetpwdVisible" />
        </template>
      </q-input>
    </q-card-section>
    <q-card-section v-if="message">
      <div v-if="message">{{ $t(message) }}</div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn :label="$t('Accept')" @click="onOk" :disabled="!isValid" />
      <q-btn :label="$t('Cancel')" v-close-popup @click="onCancel" color="red" />
    </q-card-actions>
  </q-card>
</template>
<script>
export default {
  props: ['code'],
  data () {
    return {
      email: null,
      password: null,
      repeatPassword: null,
      message: null,
      pwdVisible: false,
      resetpwdVisible: false
    }
  },
  computed: {
    resetAsked () {
      return !this.$props.code
    },
    isValid () {
      return this.resetAsked
        ? this.email : (this.password && this.password === this.repeatPassword)
    }
  },
  methods: {
    async onOk () {
      try {
        this.message = null
        if (this.resetAsked) {
          await this.$storex.user.forgotPassword(this.email)
        } else {
          const { code, password } = this
          await this.$storex.user.resetPassword({ code, password })
        }
        this.$emit('ok')
      } catch (error) {
        this.message = error.response.data.message[0].messages[0].message
      }
    },
    onCancel () {
    }
  }
}
</script>
