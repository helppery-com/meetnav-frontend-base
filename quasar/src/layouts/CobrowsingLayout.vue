<template>
  <q-layout view="hHh lpR fff" class="main-layout">
    <q-header class="main-header flex items-center justify-between full-width">
      <div class="float-left">
        <p class="text-h3 q-ml-md main-heading">meetnav</p>
      </div>
      <div class="float-right flex ">
        <q-icon name="share" class="q-mx-sm" style="font-size: 50px"></q-icon>
        <q-icon name="settings" class="q-mx-sm" style="font-size: 50px"></q-icon>
        <q-icon name="chat" class="q-mx-sm" style="font-size: 50px"></q-icon>
        <q-btn style="background: #FF0080; color: white" class="q-mx-sm" label="Username" />
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
export default {
  components: {
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
    }
  }
}
</script>
<style lang="sass">
.main-layout
  .main-header
    width: 100%
    background-color: #e8e6e9

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
