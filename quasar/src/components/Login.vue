<template>
  <q-btn type="submit" v-bind:label="$t('welcomePage.login')" class="login q-mt-md nav-button ref-login" color="primary" @click="openLoginDialog = true" >
    <q-dialog v-model="openLoginDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="q-gutter-y-sm q-pa-md" style="width: 450px">
        <form method="post" @submit.prevent="login">
          <q-card-section><div class="text-h6 text-blue-grey-8">{{$t('welcomePage.moreLogin.login')}}</div></q-card-section>
          <q-card-section>
              <q-input color="blue-grey-6" name='username' v-model="user.username" :label="$t('welcomePage.moreLogin.username')" required class="ref-login-username">
                <template v-slot:prepend><q-icon name="mail" /></template>
              </q-input>
              <q-input color="blue-grey-6" name='password' type="password" v-model="user.password" :label="$t('welcomePage.moreLogin.password')" required class="ref-login-password">
                <template v-slot:prepend><q-icon name="lock" /></template>
              </q-input>
          </q-card-section>
          <q-card-section class="message__panel">
            <div class="error">{{ message }}</div>
            <router-link class="form-link" to="#">{{ $t('welcomePage.moreLogin.forgotPassword') }}</router-link>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn type="submit" :loading="loading" :label="$t('welcomePage.login')" class="q-mt-md nav-button ref-login-submit" color="blue-grey-6"></q-btn>
            <q-btn v-bind:label="$t('welcomePage.moreLogin.cancel')" class="q-mt-md nav-button" color="red" v-close-popup></q-btn>
          </q-card-actions>
        </form>
      </q-card>
    </q-dialog>
  </q-btn>
</template>

<script>
export default {
  data () {
    return {
      user: { username: '', password: '' },
      openLoginDialog: false,
      loading: false,
      message: ''
    }
  },
  methods: {
    async login (credentials) {
      const username = credentials.target.username.value
      const password = credentials.target.password.value
      this.loading = true
      try {
        await this.$storex.user.login({ username, password })
        this.openLoginDialog = false
        this.$root.$emit('user-logged')
      } catch (error) {
        this.message = this.$t('Identifier or password invalid.')
      } finally {
        this.loading = false
      }
    }
  },
  created () {
    this.$root.$on('login', () => { this.openLoginDialog = true })
  }
}
</script>

<style scoped>
.error{
  color: #f00;
}
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
