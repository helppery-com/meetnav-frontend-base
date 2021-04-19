<template>
  <q-layout view="hHh lpR fff" class="main-layout ">

    <q-header class="main-header full-width">
      <div class="float-left">
        <p class="text-h2 q-ml-md main-heading">meetnav</p>
      </div>
      <div v-if="getUser.avatar" class="float-right">
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
              <q-item clickable v-ripple to="/" exact>
                <q-item-section avatar>
                  <q-icon name="home" />
                </q-item-section>
                <q-item-section>Home</q-item-section>
              </q-item>
              <q-item clickable v-ripple to="/user/profile" exact>
                <q-item-section avatar>
                  <q-icon name="home" />
                </q-item-section>
                <q-item-section>Profile</q-item-section>
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
      <div v-else class="float-right">
        <!-- Login button -->
        <login-btn id="loginButton" class="auth-buttons" />
        <!-- Registration button -->
        <register-btn id="signupButton" class="auth-buttons" />
        <q-btn class="burger-icon" size="30px" color="black" dense flat round icon="menu" @click="right = !right" />
      </div>
    </q-header>
    <q-drawer v-model="right" side="right" overlay behavior="mobile" bordered>
      <q-scroll-area v-if="Object.keys(getUser).length === 0" class="full-height" style=" border-right: 1px solid #ddd">
        <q-list padding>
          <q-item clickable v-ripple  @click="openAuthModal('login')">
            <q-item-section>
              <div class="full-width flex items-center" style="height: 50px">
                <p>{{$t('welcomePage.login')}}</p>
              </div>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="openAuthModal('signup')">
            <q-item-section>
              <div class="full-width items-center" style="height: 50px">
                <p>{{$t('welcomePage.signup')}}</p>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <q-scroll-area  v-if="Object.keys(getUser).length > 0" style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list>
          <q-item clickable v-ripple to="/" exact>
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>Home</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/user/profile" exact>
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>Profile</q-item-section>
          </q-item>
          <q-item class="text-red" clickable v-ripple @click="logout">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>
            <q-item-section>Logout</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <q-img v-if="Object.keys(getUser).length > 0" class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://placeimg.com/500/300/nature">
          </q-avatar>
          <div class="text-weight-bold">you are the user</div>
        </div>
      </q-img>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <shared-footer></shared-footer>
  </q-layout>
</template>

<script>

import SharedFooter from 'components/SharedFooter'
import Login from '../components/Login.vue'
import Registration from '../components/Registration.vue'
export default {
  components: {
    LoginBtn: Login,
    RegisterBtn: Registration,
    SharedFooter: SharedFooter
  },
  data () {
    return {
      right: false,
      selectedLanguage: 'English'
    }
  },
  methods: {
    changeLanguage (lang) {
      this.$i18n.locale = lang
      this.selectedLanguage = this.$t('name')
    },
    logout () {
      this.$store.commit('user/SET_USER', {})
      location.reload()
    },
    openAuthModal (auth) {
      switch (auth) {
        case 'login': {
          document.getElementById('loginButton').click()
          break
        }
        case 'signup': {
          document.getElementById('signupButton').click()
          break
        }
      }
    }
  },
  computed: {
    getUser () {
      return this.$store.getters['user/getUser']
    }
  },
  mounted () {
    console.log(this.$store.getters['user/getUser'])
  }
}
</script>
<style lang="sass">
.main-layout
  .main-header
    width: 100%
    background-color: white

  .nav-button
    margin-right: 10px

  .language-section > p
    font-size: 12px
    margin-bottom: 0

  .form-link
    color:#3a5e83
    text-decoration: none

  .form-link:hover
    text-decoration: underline
.burger-icon
  display: none
.auth-buttons
  display: inline

@media screen and (max-width: 500px)
  .main-layout
    .footer-area
      width: 100%
      height: 80px
      background-color: #edeff1

    .language-section
      width: 100%
      height: 60%
      border-bottom-style: solid
      border-bottom-width: 2px
      border-bottom-color: dimgray
      color: black
@media screen and (max-width: 600px)
  .auth-buttons
    display: none
  .burger-icon
    display: block

</style>
