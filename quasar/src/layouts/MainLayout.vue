<template>
  <q-layout view="hHh lpR fff" class="main-layout">

    <q-header class="main-header full-width">
      <div class="row float-left main-heading" @clik="goHome">
        <div class="col-auto q-pl-md q-py-md q-pr-xs">
          <img src="/logo.png" width="40px" />
        </div>
        <div class="col-auto text-h2">meetnav</div>
      </div>
      <q-separator />
      <div v-if="user" class="row justify-end">
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
            <router-link to="/account">
            <q-item class="text-black" clickable v-ripple v-if="false">
              <q-item-section avatar>
                <q-icon name="settings" />
              </q-item-section>
              <q-item-section>{{ $t('Account Settings') }}</q-item-section>
            </q-item>
            </router-link>
          </q-list>
        </q-menu>
      </q-btn>
      </div>
      <div v-else class="float-right">
        <!-- Login button -->
        <Login />
        <!-- Registration button -->
        <Registration />
      </div>
      <q-dialog
        v-model="resetPassword"
        persistent
        @hide="onResetPwdHide"
      >
        <ResetPassword
          @ok="resetPassword = false"
          :code="resetCode" />
      </q-dialog>
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
import ResetPassword from '../components/ResetPassword'

export default {
  components: {
    Login,
    Registration,
    SharedFooter,
    ResetPassword
  },
  data () {
    return {
      selectedLanguage: 'English',
      resetPassword: !!this.$route.query.resetcode || !!this.$route.query.resetPassword
    }
  },
  mounted () {
    this.$root.$on('user-reset-password', () => { this.resetPassword = true })
  },
  methods: {
    changeLanguage (lang) {
      this.$i18n.locale = lang
      this.selectedLanguage = this.$t('name')
    },
    logout () {
      this.$storex.user.logout()
      location.reload()
    },
    goHome () {
      if (this.$route.path !== '/') {
        this.$router.push('/')
      }
    },
    onResetPwdHide () {
      const { query } = this.$route
      query.resetPassword = undefined
      query.resetcode = undefined
      this.$router.replace({ query })
    }
  },
  computed: {
    user () {
      return this.$storex.user.user
    },
    avatar () {
      return this.$storex.user.user.avatar
    },
    resetCode () {
      return this.$route.query.resetcode
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
