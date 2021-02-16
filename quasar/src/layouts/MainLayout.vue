<template>
  <q-layout view="hHh lpR fff" >

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
export default {
  components: {
    LoginBtn: Login,
    RegisterBtn: Registration,
    SharedFooter: SharedFooter
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
