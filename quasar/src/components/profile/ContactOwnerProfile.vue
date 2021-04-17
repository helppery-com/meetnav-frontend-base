<template>
  <div class="col-6 flex items-stretch cover-section-parent">
    <div class="full-width relative-position bg-green cover-section">
      <img  class="full-width full-height " style=" object-fit: fill;" v-bind:src="getBackgrounfPicture" alt="cover photo">
      <div class="absolute flex column items-center" style="top: 50%; left: calc(50% - 125px); right: calc(50% - 125px)">
        <q-avatar class="bg-black" size="250px">
          <img v-bind:src="getLogo">
        </q-avatar>
        <h4 class="text-h4">{{getUsername}}</h4>
      </div>
    </div>
    <div  class="full-width q-pb-lg flex column justify-between contact-section">
      <div class="full-width flex items-center justify-around">
        <q-btn color="black" outline style="width: 45%; height: 60px" @click="showBookingPage">
          <q-icon left size="3em" name="videocam"/>
          {{$t('selectDateTime.callNow')}}
        </q-btn>
        <q-btn color="black" outline  style="width: 45%; height: 60px" @click="showBookingPage">
          <q-icon left size="3em" name="far fa-calendar-alt"/>
          {{$t('selectDateTime.bookCall')}}
        </q-btn>
      </div>
      <div class="full-width flex items-center justify-around">
        <q-btn
          v-for="(links,index) in getSocialLinks"
          v-bind:key="index"
          size="25px"
          round
          color="blue"
          v-bind:icon=getIcon(links.type)
          @click="navigateToPage(links.url)"
        />

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactOwnerProfile',
  props: ['backgroundPicture', 'username', 'logo', 'socialLinks'],
  computed: {
    getBackgrounfPicture () {
      return this.backgroundPicture
    },
    getUsername () {
      return this.username
    },
    getLogo () {
      return this.logo
    },
    getSocialLinks () {
      return this.socialLinks
    }
  },
  methods: {
    showBookingPage () {
      this.$emit('showBookingPage')
    },
    getIcon (value) {
      return `fab fa-${value}`
    },
    navigateToPage (link) {
      window.open(link)
    }
  }
}
</script>

<style scoped>

</style>
