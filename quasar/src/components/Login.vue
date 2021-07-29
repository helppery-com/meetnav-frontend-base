<template>
  <q-btn type="submit" v-bind:label="$t('welcomePage.login')" class="login q-mt-md nav-button ref-login" color="primary" @click="openLoginDialog = true" >
    <q-dialog v-model="openLoginDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="q-gutter-y-sm q-pa-md" style="width: 450px">
        <q-card-section>
          <div class="text-h3 text-blue-grey-8">
            {{ isForgotPwd ? $t('Reset password') : $t('Login') }}
          </div>
        </q-card-section>
        <q-card-section v-if="isForgotPwd">
          {{ $t('We\'ll send you a reset password link to your email.') }}
        </q-card-section>
        <q-card-section v-if="isForgotPwd">
          <q-input name="email" type="email" color="blue-grey-6" v-model="user.email" :label="$t('welcomePage.moreSignup.email')" required>
            <template v-slot:prepend><q-icon name="mail" /></template>
          </q-input>
        </q-card-section>
        <q-card-section v-else>
          <q-input color="blue-grey-6" name='username' v-model="user.username"
            :label="$t('welcomePage.moreLogin.username')" required class="ref-login-username"
            @keypress.enter="login"
          >
            <template v-slot:prepend><q-icon name="mail" /></template>
          </q-input>
          <q-input color="blue-grey-6" name='password' type="password" v-model="user.password"
          :label="$t('welcomePage.moreLogin.password')" required class="ref-login-password"
          @keypress.enter="login">
            <template v-slot:prepend><q-icon name="lock" /></template>
          </q-input>
        </q-card-section>
        <q-card-section class="message__panel">
          <div class="error">{{ message }}</div>
          <a class="btn" @click="isForgotPwd = true" v-if="!isForgotPwd">
            {{ $t('welcomePage.moreLogin.forgotPassword') }}
          </a>
        </q-card-section>
        <q-card-actions align="right" v-if="$isGuest">
          <q-btn :label="$t('Ok')"/>
        </q-card-actions>
        <q-card-actions align="right" v-else>
          <q-btn :loading="loading"
            :label="isForgotPwd ? $t('Reset password') : $t('welcomePage.login')"
            class="q-mt-md nav-button ref-login-submit"
            color="blue-grey-6"
            @click="isForgotPwd ? resetPassword() : login()"/>
          <q-btn v-bind:label="$t('welcomePage.moreLogin.cancel')"
            class="q-mt-md nav-button"
            color="red"
            @click="cancel"
            v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-btn>
</template>

<script>
export default {
  data () {
    return {
      user: { username: '', password: '', displayName: '' },
      openLoginDialog: !!this.$route.query.login,
      loading: false,
      message: '',
      isForgotPwd: false
    }
  },
  methods: {
    async login () {
      this.loading = true
      try {
        await this.$storex.user.login(this.user)
        this.$i18n.locale = this.$storex.user.lang
        this.openLoginDialog = false
        this.$root.$emit('user-logged')
      } catch (error) {
        this.message = this.$t('Identifier or password invalid.')
      } finally {
        this.loading = false
      }
    },
    async resetPassword () {
      if (this.user.email) {
        await this.$storex.user.resetPassword(this.user)
        this.message = 'We have sent you an email with instructions to reset your password.'
      } else {
        this.message = 'Invalid email'
      }
    },
    cancel () {
      if (this.isForgotPwd) {
        this.isForgotPwd = false
      } else {
        this.$root.$emit('user-login-cancel')
      }
    }
  },
  created () {
    this.$root.$on('login', user => {
      if (user) {
        this.user = user
        this.login()
      } else {
        this.openLoginDialog = true
      }
    })
  }
}
</script>

<style scoped>
.message__panel{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.form-link{
  color:#3a5e83;
  text-decoration: none;
}
.form-link:hover{
  text-decoration: underline;
}
</style>
