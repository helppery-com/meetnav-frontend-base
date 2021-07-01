<template>
  <q-layout view="hHh lpR fff" class="main-layout">

    <q-header class="main-header full-width">
      <div class="float-left">
        <p class="text-h2 q-ml-md main-heading">meetnav</p>
      </div>
      <q-separator />
      <div v-if="user" class="row justify-end">
        <NekoRooms />
        <q-btn round class="col-auto q-mt-md nav-button ref-user-menu">
          <q-avatar size="42px">
            <img :src="avatar">
          </q-avatar>
        <q-menu
          transition-show="scale"
          transition-hide="scale"
          :offset="[-15, 10]"
        >
          <q-list style="min-width: 100px">
            <q-item class="text-red ref-user-logout" clickable v-ripple @click="logout">
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
        <login-btn />
        <!-- Registration button -->
        <register-btn />
      </div>
    </q-header>

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
import NekoRooms from '../components/NekoRooms.vue'

export default {
  components: {
    LoginBtn: Login,
    RegisterBtn: Registration,
    SharedFooter,
    NekoRooms
  },
  data () {
    return {
      selectedLanguage: 'English'
    }
  },
  methods: {
    changeLanguage (lang) {
      this.$i18n.locale = lang
      this.selectedLanguage = this.$t('name')
    },
    logout () {
      this.$storex.user.logout()
      location.reload()
    }
  },
  computed: {
    user () {
      return this.$storex.user.user
    },
    avatar () {
      return this.$storex.user.user.avatar
    }
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
</style>
