<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white header text-black q-pt-md" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <div class="full-width flex row items-center lg-hide xl-hide justify-between">
          <p class="text-h4  main-heading lg-hide xl-hide" v-on:click="this.goToHome">meetnav</p>
            <q-img
              :src="url"
              spinner-color="purple-7"
              img-class="img-circles lg-hide xl-hide"
              style=" width: 50px; height: 50px;border-radius: 50% 50%; border-width: 2px; border-style: solid; border-color: white; transform: translateX(0px)"
            />
          </div>
          <div class="full-width  row">
            <span class="text-h4 col-1 main-heading xs-hide sm-hide md-hide">meetnav</span>
            <div class="col-lg-6 col-xl-6 col-xs-12 col-sm-12 col-md-12">
            <!--      search input       -->
              <search-input-component></search-input-component>
            </div>
            <div class="col-5 flex items-center justify-end xs-hide sm-hide md-hide">
            <q-img
              :src="url"
              spinner-color="purple-7"
              img-class="img-circles"
              style=" width: 50px; height: 50px;border-radius: 50% 50%; border-width: 2px; border-style: solid; border-color: white; transform: translateX(0px)"
            />
            </div>
          </div>
        </q-toolbar-title>
      </q-toolbar>
      <div class="full-width row q-mt-xs">
        <div class="col-1 xs-hide sm-hide md-hide"></div>
        <div class="col-11 ">
      <q-tabs inline-label no-caps align="left">
        <q-route-tab to="/search" icon="search" v-bind:label="$t('searchPage.tabs.search')" />
        <q-route-tab to="/page2" icon="cast" v-bind:label="$t('searchPage.tabs.navRoom')" />
        <q-route-tab to="/page3" icon="people" v-bind:label="$t('searchPage.tabs.myPeople')" />
        <q-route-tab to="/page3" icon="favorite" v-bind:label="$t('searchPage.tabs.navList')" />
        <q-route-tab to="/page3" icon="account_circle" v-bind:label="$t('searchPage.tabs.me')" />
        <q-route-tab to="/page3" v-bind:label="$t('searchPage.tabs.more')"/>
      </q-tabs>
        </div>
      </div>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <Footer></Footer>
  </q-layout>
</template>
<script>
import Footer from 'components/Footer'
import SearchInputComponent from 'components/SearchInputComponent'
export default {
  name: 'SearchLayout',
  data () {
    return {
      url: 'https://placeimg.com/500/300/nature'
    }
  },
  components: {
    Footer,
    SearchInputComponent
  },
  methods: {
    goToHome () {
      alert('called')
      this.$router.push({ path: '/' })
    }
  }
}
</script>
<style scoped>
.main-heading {
  color: #3d7094;
  font-weight: 900;
}
.main-heading:hover {
  cursor: pointer;
}
.header {
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #d2d4d6;
}
</style>
