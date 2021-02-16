<template>
  <q-layout view="hHh lpR fff">
    <q-header  class="bg-white header text-black q-pt-md" height-hint="98">
      <q-toolbar >
        <q-toolbar-title>
<!--          <div class="full-width flex row items-center lg-hide xl-hide justify-between">-->
<!--          <p class="text-h4  main-heading lg-hide xl-hide" v-on:click="this.goToHome">meetnav</p>-->
<!--            <q-icon name="menu"/>-->
<!--          </div>-->
          <div class="full-width  row">
            <span class="text-h4 col-xs-4 col-sm-3 col-md-2 col-lg-1 col-xl-1  main-heading">meetnav</span>
            <div class="col-xs-8 col-sm-6 col-md-8 col-lg-6 col-xl-6 flex controller">
            <!--      search input       -->
              <search-input-component ></search-input-component>
            </div>
          </div>
        </q-toolbar-title>
        <q-btn class="sm-hide lg-hide md-hide xl-hide" dense flat round icon="menu" @click="right = !right" />
        <q-img
          class="xs-hide"
          :src="url"
          spinner-color="purple-7"
          img-class="img-circles "
          style=" width: 50px; height: 50px;border-radius: 50% 50%; border-width: 2px; border-style: solid; border-color: white; transform: translateX(0px)"
        />
      </q-toolbar>
      <div class="full-width row q-mt-xs">
        <div class="col-1 xs-hide "></div>
        <div class="col-11 ">
      <q-tabs dense class="xs-hide" inline-label no-caps align="left">
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
    <q-drawer v-model="right" side="right" overlay behavior="mobile" bordered>
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list padding>
          <q-item v-bind:active="shouldDrawerItemBeSelected('/search')" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="search" />
            </q-item-section>

            <q-item-section>
             {{$t('searchPage.tabs.search')}}
            </q-item-section>
          </q-item>

          <q-item v-bind:active="shouldDrawerItemBeSelected('/navroom')" clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="cast" />
            </q-item-section>

            <q-item-section>
              {{$t('searchPage.tabs.navRoom')}}
            </q-item-section>
          </q-item>

          <q-item clickable v-bind:active="shouldDrawerItemBeSelected('/people')" v-ripple>
            <q-item-section avatar>
              <q-icon name="people" />
            </q-item-section>

            <q-item-section>
              {{$t('searchPage.tabs.myPeople')}}
            </q-item-section>
          </q-item>

          <q-item clickable v-bind:active="shouldDrawerItemBeSelected('/favorite')" v-ripple>
            <q-item-section avatar>
              <q-icon name="favorite" />
            </q-item-section>

            <q-item-section>
              {{$t('searchPage.tabs.navList')}}
            </q-item-section>
          </q-item>
          <q-item clickable v-bind:active="shouldDrawerItemBeSelected('/personal')" v-ripple>
            <q-item-section avatar>
              <q-icon name="account_circle" />
            </q-item-section>

            <q-item-section>
              {{$t('searchPage.tabs.me')}}
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <div class="text-weight-bold">Razvan Stoenescu</div>
          <div>@rstoenescu</div>
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
import SearchInputComponent from 'components/SearchInputComponent'
export default {
  name: 'SearchLayout',
  data () {
    return {
      url: 'https://placeimg.com/500/300/nature',
      right: false,
      currentRoute: false
    }
  },
  mounted () {
    console.log(this.$router.currentRoute.path)
  },
  components: {
    SharedFooter,
    SearchInputComponent
  },
  methods: {
    goToHome () {
      alert('called')
      this.$router.push({ path: '/' })
    },
    shouldDrawerItemBeSelected (currentRoute) {
      return this.$router.currentRoute.path === currentRoute
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
.controller{
  justify-content: flex-start;
}
.controller > * {
width: 100%;
}
@media screen and (max-width: 422px) {
.controller {
  justify-content: center;

}
  .controller > * {
    width: 190px;
  }
}
@media screen and (max-width: 400px) {
  .controller {
    justify-content: center;

  }
  .controller > * {
    width: 150px;
  }
}
@media screen and (max-width: 350px) {
  .controller {
    justify-content: flex-end;

  }
  .controller > * {
    width: 110px;
  }
}
</style>
