<template>
  <q-layout view="lHh Lpr lFf" class="main-layout">
    <q-header class="main-header">
      <q-toolbar-title class="q-ml-md">
        <span class="text-h4 col-xs-4 col-sm-3 col-md-2 col-lg-1 col-xl-1  main-heading">meetnav</span>
      </q-toolbar-title>
      <q-separator />
      <NekoControls class="q-ma-xs" />
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import NekoControls from '../components/neko/NekoControls'
export default {
  components: {
    NekoControls
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
      location.reload()
    }
  }
}
</script>
<style lang="sass">
.main-layout
  .main-header
    width: 100%
    display: flex
    align-items: center
    justify-content: flex-end
    background-color: transparent

  .main-heading
    color: $primary
    font-weight: 900

  .main-heading:hover
    cursor: pointer

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
