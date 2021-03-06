<template>
  <q-layout view="hHh lpR fff" class="main-layout">
    <q-header class="main-header row items-center justify-between full-width">
      <div class="col-xl-2 col-lg-3 col-md-3 ">
        <p class="text-h3 q-ml-md main-heading">meetnav</p>
      </div>
      <div class=" sm-hide xs-hide col-xl-7 col-lg-6 col-md-5 flex justify-start items-center">
        <q-btn round color="primary" class="q-mx-md q-ml-xl" icon="facebook" />
        <q-btn round color="primary" class="q-mx-md " icon="shopping_cart" />
        <q-btn round color="primary" class="q-mx-md " icon="shopping_cart" />
        <q-btn round color="primary" class="q-mx-md " icon="shopping_cart" />
        <q-btn round color="primary" class="q-mx-md " icon="mail_outline" />
      </div>
      <div class="col-xl-3 col-lg-3 col-md-4 row justify-end">
        <q-icon name="share" class="q-mx-sm nav-icon-size"></q-icon>
        <q-icon name="settings" class="q-mx-sm nav-icon-size"></q-icon>
        <q-icon name="chat" class="q-mx-sm nav-icon-size" ></q-icon>
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
.nav-icon-size
  font-size: 50px
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

@media screen and (max-width: 536px)
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
    .nav-icon-size
      font-size: 40px
@media screen and (max-width: 430px)
  .nav-icon-size
    display: none

</style>
