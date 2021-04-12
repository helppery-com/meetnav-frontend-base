<template>
  <q-layout view="lHh Lpr lFf" class="main-layout">
    <Login v-if="!user" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Login from '../components/Login'

export default {
  components: {
    Login
  },
  data () {
    return {
      selectedLanguage: 'English'
    }
  },
  computed: {
    user () {
      return this.$storex.user.user
    },
    neko () {
      return this.$storex.room.nekoConnected
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
    }
  }
}
</script>
<style lang="sass">
</style>
