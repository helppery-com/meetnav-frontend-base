<template>
  <q-btn type="submit" :label="$t('welcomePage.signup')" class="q-mt-md nav-button" color="indigo-10" @click="openDialog" >
    <q-dialog v-model="openRegisterDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="q-gutter-y-sm q-pa-md" style="width: 450px">
        <form v-if="!createSuccessfull" method="post" @submit.prevent="register">
          <q-card-section><div class="text-h6 text-blue-grey-8">{{$t('welcomePage.moreSignup.register')}}</div></q-card-section>
          <q-card-section>
              <q-input name="email" type="email" color="blue-grey-6" v-model="newUser.email" :label="$t('welcomePage.moreSignup.email')" required>
                <template v-slot:prepend><q-icon name="mail" /></template>
              </q-input>
              <q-input name="password" type="password" color="blue-grey-6" v-model="newUser.password" :label="$t('welcomePage.moreSignup.password')" required>
                <template v-slot:prepend><q-icon name="lock" /></template>
              </q-input>
              <q-input name="rePassword" type="password" color="blue-grey-6" v-model="newUser.rePassword" :label="$t('welcomePage.moreSignup.repeatPassword')" required>
                <template v-slot:prepend><q-icon name="lock" /></template>
              </q-input>
          </q-card-section>
          <q-card-section class="message__panel">
            <div class="error">{{ message }}</div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn type="submit" :loading="loading" :label="$t('welcomePage.moreSignup.register')" class="q-mt-md nav-button" color="blue-grey-6"></q-btn>
            <q-btn :label="$t('welcomePage.moreSignup.cancel')" class="q-mt-md nav-button" color="red" v-close-popup></q-btn>
          </q-card-actions>
        </form>
        <div v-else>
          <q-card-section><div class="text-h6 text-blue-grey-8">{{$t('welcomePage.moreSignup.successMessage')}}</div></q-card-section>
          <q-card-actions align="right">
            <q-btn @click="reset" :label="$t('welcomePage.moreSignup.ok')" class="q-mt-md nav-button q-px-md" color="blue-grey-6"></q-btn>
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>
  </q-btn>
</template>

<script>
export default {
  data () {
    return {
      newUser: { email: '', password: '', rePassword: '' },
      openRegisterDialog: false,
      loading: false,
      createSuccessfull: false,
      message: ''
    }
  },
  methods: {
    register (credentials) {
      const email = credentials.target.email.value
      const password = credentials.target.password.value
      const rePassword = credentials.target.rePassword.value
      this.loading = true
      setTimeout(async () => {
        try {
          const { ok, message } = await this.$store.dispatch('user/registration', { email, password, rePassword })
          this.loading = false
          if (!ok) {
            throw new Error(message)
          }
          this.message = message
          this.createSuccessfull = true
          this.openLoginDialog = false
        } catch (error) {
          this.message = error.message
        }
      }, 3000)
    },
    openDialog () {
      this.openRegisterDialog = true
      this.newUser.email = ''
      this.newUser.password = ''
      this.newUser.rePassword = ''
    },
    reset () {
      this.createSuccessfull = false
      this.newUser.email = ''
      this.newUser.password = ''
      this.newUser.rePassword = ''
    }
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
</style>
