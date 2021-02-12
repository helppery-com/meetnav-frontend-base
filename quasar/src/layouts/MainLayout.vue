<template>
  <q-layout view="hHh lpR fFf" >

    <q-header class="main-header">
      <div v-if="getUser.avatar">
        <q-btn round class="q-mt-md nav-button">
          <q-avatar size="42px">
            <img :src="getUser.avatar">
          </q-avatar>
        <q-menu
          transition-show="scale"
          transition-hide="scale"
          :offset="[-15, 10]"
        >
          <q-list style="min-width: 100px">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>
              <q-item-section>Home</q-item-section>
            </q-item>
            <q-item class="text-red" clickable v-ripple @click="logout">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>Logout</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
      </div>
      <div v-else>
      <q-btn
        type="submit"
        v-bind:label="$t('welcomePage.login')"
        class="q-mt-md nav-button"
        color="indigo-10"
        @click="openLoginDialog = true"
      >
        <template v-slot:loading>
          <q-spinner
            color='primary'
            size="3em"
          />
        </template>
      </q-btn>
      <q-btn
        type="submit"
        v-bind:label="$t('welcomePage.signup')"
        class="q-mt-md nav-button"
        color="blue-grey-7"
        @click="openRegisterDialog = true"
      >
        <template v-slot:loading>
          <q-spinner
            color="primary"
            size="3em"
          />
        </template>
      </q-btn>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer  class="bg-grey-8 ">
      <div class="footer-area">
        <div class="language-section ">
          <p class="q-ml-md">Language</p>
          <q-btn-dropdown  size="30" ref="special" text-color="black" auto-close flat v-bind:label="selectedLanguage">
            <q-item clickable v-close-popup @click="changeLanguage('en')">
              <q-item-section>
                <q-item-label>English</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage('es')">
              <q-item-section>
                <q-item-label>Español</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="changeLanguage('in')">
              <q-item-section>
                <q-item-label>हिन्दी</q-item-label>
              </q-item-section>
            </q-item>
          </q-btn-dropdown>
        </div>
        <div class=" flex items-center justify-end" style="height: 45%">
            <span style="color: #17416c">Credits:</span> <a class="q-ml-md" style="color: #80a8b8;text-decoration: none" href="https://www.freepik.com">www.freepik.com</a>
        </div>
      </div>
    </q-footer>
    <!-- Login Dialog -->
    <q-dialog v-model="openLoginDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="q-gutter-y-sm q-pa-md" style="width: 450px">
        <form method="post" @submit.prevent="login">
          <q-card-section><div class="text-h6 text-blue-grey-8">{{$t('welcomePage.moreLogin.login')}}</div></q-card-section>
          <q-card-section>
              <q-input color="blue-grey-6" name='username' v-model="user.username" :label="$t('welcomePage.moreLogin.username')" required>
                <template v-slot:prepend><q-icon name="mail" /></template>
              </q-input>
              <q-input color="blue-grey-6" name='password' type="password" v-model="user.password" :label="$t('welcomePage.moreLogin.password')" required>
                <template v-slot:prepend><q-icon name="lock" /></template>
              </q-input>
          </q-card-section>
          <q-card-section style="text-align: right">
            <router-link class="form-link" to="#">{{ $t('welcomePage.moreLogin.forgotPassword') }}</router-link>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn type="submit" :loading="loading" :label="$t('welcomePage.login')" class="q-mt-md nav-button" color="blue-grey-6"></q-btn>
            <q-btn v-bind:label="$t('welcomePage.moreLogin.cancel')" class="q-mt-md nav-button" color="red" v-close-popup></q-btn>
          </q-card-actions>
        </form>
      </q-card>
    </q-dialog>

    <!-- Registration Dialog -->
    <q-dialog v-model="openRegisterDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="q-gutter-y-sm q-pa-md" style="width: 450px">
        <form v-if="!createSuccessfull" method="post" @submit.prevent="register">
          <q-card-section><div class="text-h6 text-blue-grey-8">{{$t('welcomePage.moreSignup.register')}}</div></q-card-section>
          <q-card-section>
              <q-input name="email" type="text" color="blue-grey-6" v-model="newUser.email" :label="$t('welcomePage.moreSignup.email')" required>
                <template v-slot:prepend><q-icon name="mail" /></template>
              </q-input>
              <q-input name="password" type="password" color="blue-grey-6" v-model="newUser.password" :label="$t('welcomePage.moreSignup.password')" required>
                <template v-slot:prepend><q-icon name="lock" /></template>
              </q-input>
              <q-input name="rePassword" type="password" color="blue-grey-6" v-model="newUser.rePassword" :label="$t('welcomePage.moreSignup.repeatPassword')" required>
                <template v-slot:prepend><q-icon name="lock" /></template>
              </q-input>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn type="submit" :loading="loading" :label="$t('welcomePage.moreSignup.register')" class="q-mt-md nav-button" color="blue-grey-6"></q-btn>
            <q-btn :label="$t('welcomePage.moreSignup.cancel')" class="q-mt-md nav-button" color="red" v-close-popup></q-btn>
          </q-card-actions>
        </form>
        <div v-else>
          <q-card-section><div class="text-h6 text-blue-grey-8">{{$t('welcomePage.moreSignup.successMessage')}}</div></q-card-section>
          <q-card-actions align="right">
            <q-btn @click="openRegisterDialog = false" :label="$t('welcomePage.moreSignup.ok')" class="q-mt-md nav-button w-100" color="blue-grey-6"></q-btn>
          </q-card-actions>
        </div>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
export default {
  data () {
    return {
      selectedLanguage: 'English',
      openLoginDialog: false,
      openRegisterDialog: false,
      user: { username: '', password: '' },
      newUser: { email: '', password: '', rePassword: '' },
      loading: false,
      createSuccessfull: false
    }
  },
  methods: {
    changeLanguage (lang) {
      this.$i18n.locale = lang
      this.selectedLanguage = this.$t('name')
    },
    login (credentials) {
      const username = credentials.target.username.value
      const password = credentials.target.password.value
      this.loading = true
      setTimeout(() => {
        this.$store.dispatch('user/login', { username, password }).then(({ ok, user, message }) => {
          if (ok) {
            this.$store.commit('user/SET_USER', user)
            console.log(message)
            this.openLoginDialog = false
          } else {
            console.log(message)
          }
          this.loading = false
        })
      }, 3000)
    },
    async register (credentials) {
      const email = credentials.target.email.value
      const password = credentials.target.password.value
      const rePassword = credentials.target.rePassword.value
      this.loading = true
      setTimeout(() => {
        this.$store.dispatch('user/registration', { email, password, rePassword }).then(({ ok, message }) => {
          if (ok) {
            console.log(message)
            this.createSuccessfull = true
          } else {
            console.log(message)
          }
          this.loading = false
        })
      }, 3000)
    },
    logout () {
      this.$store.commit('user/SET_USER', {})
    }
  },
  computed: {
    getUser () {
      return this.$store.getters['user/getUser']
    }
  }
}
</script>
<style scoped>
.main-header{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: transparent;
}
.nav-button{
  margin-right: 10px;
}
.footer-area{
  width: 100%;
  height: 100px;
  background-color: #edeff1;
}
.language-section{
  width: 100%;
  height: 55%;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #d2d4d6;
  color: #3a5e83;
}
.language-section > p{
  font-size: 12px;
  margin-bottom: 0;
}
.form-link{
  color:#3a5e83;
  text-decoration: none;
}
.form-link:hover{
  text-decoration: underline;
}
@media screen and (max-width: 500px){
  .footer-area{
    width: 100%;
    height: 80px;
    background-color: #edeff1;
  }
  .language-section{
    width: 100%;
    height: 60%;
    border-bottom-style: solid;
    border-bottom-width: 2px;
    border-bottom-color: dimgray;
    color: black;
  }
}

</style>
