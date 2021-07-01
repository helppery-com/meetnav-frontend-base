<template>
  <q-layout view="hHh lpR fff" class="main-layout">
    <q-header v-if="getPermissionState" class="main-header row items-center justify-between full-width">
    <div class="nav-logo flex justify-center" >
      <p class="text-h2 q-ml-md main-heading">meetnav</p>
    </div>
      <div class="flex full-height justify-between items-center nav-logo-counter">
        <div class=" flex justify-between  social-link">
        <q-btn round color="primary" icon="facebook" />
        <q-btn round color="primary" icon="shopping_cart" />
        <q-btn round color="primary" icon="shopping_cart" />
        <q-btn round color="primary" icon="shopping_cart" />
        <q-btn round color="primary" icon="shopping_cart" />
        <q-btn round color="primary" icon="shopping_cart" />
        <q-btn round color="primary" icon="mail_outline" />
        </div>
      <div class="flex justify-end user-share">
        <q-icon name="share" class="q-mx-sm nav-icon-size"></q-icon>
        <q-icon name="settings" class="q-mx-sm nav-icon-size"></q-icon>
        <q-icon name="chat" class="q-mx-sm nav-icon-size" ></q-icon>
        <q-btn style="background: #FF0080; color: white" class="q-mx-sm" label="Username" />
      </div>
      </div>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
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
<style lang="sass" scoped>
.main-heading
  color: #3d7094
  font-weight: 900
.nav-logo
  width: 20%
.main-heading:hover
  cursor: pointer
.nav-logo-counter
  width: 80%
.social-link
  width: 50%
.user-share
  width: 30%
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

@media screen and (max-width: 1336px)
  .social-link
    width: 50%
  .user-share
   width: 40%
@media screen and (max-width: 1272px)
  .text-h2
    font-size: 50px
@media screen and (max-width: 1100px)
  .text-h2
    font-size: 40px
  .social-link
    width: 50%
  .user-share
    width: 50%
@media screen and (max-width: 880px)
  .social-link
    display: none
  .text-h2
    font-size: 30px
  .user-share
    width: 100%
  .nav-logo
    width: 30%
  .nav-logo-counter
    width: 70%
@media screen and (max-width: 536px)
  .nav-logo
   width: 32%
  .nav-logo-counter
    width: 67%
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
  .nav-logo
    width: fit-content
  .nav-logo-counter
    width: fit-content
</style>
