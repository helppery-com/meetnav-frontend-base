<template>
<q-page class="full-width adjusted-height-profile items-center justify-center row" v-bind:class="{'profile-column': showBooking}">
  <div v-if="!showBooking" class="col-6 flex column items-center justify-start full-height">
<!--    store bio -->
   <bio-component
     v-bind:intro="response.intro"
     v-bind:subtitle="response.subtitle"
     v-bind:title="response.title"
     v-bind:logo="response.logo"
   ></bio-component>
    <q-carousel
      v-model="slide"
      swipeable
      animated
      class="carousel-height"
      :autoplay="true"
      infinite
      style="overflow: hidden"
    >
      <q-carousel-slide v-bind:name="index" class="" v-for="(images,index) in response.gallery" v-bind:key="index">
        <q-img
          v-bind:src="images"
          class="carousel-image"
        />
      </q-carousel-slide>
    </q-carousel>
    <div class="profile-contact-button full-width wrap flex justify-around items-center contact-section">
        <q-btn color="black" outline style="width: 200px; height: 60px" @click="showBookingPage">
          <q-icon left size="3em" name="videocam"/>
          {{$t('selectDateTime.callNow')}}
        </q-btn>
        <q-btn color="black" outline  style="width: 200px; height: 60px" @click="showBookingPage">
          <q-icon left size="3em" name="far fa-calendar-alt"/>
          {{$t('selectDateTime.bookCall')}}
        </q-btn>
    </div>
  </div>
  <contact-owner-profile v-if="!showBooking"
    @showBookingPage="showBookingPage"
    v-bind:background-picture="response.backgroundPicture"
    v-bind:username="response.username"
    v-bind:logo="response.logo"
    v-bind:social-links="response.social"
  >
  </contact-owner-profile>
<desktop-account-review
  v-if="showBooking"
  v-bind:logo="response.logo">
</desktop-account-review>
<mobile-account-review
v-if="showBooking"
v-bind:logo="response.logo"
></mobile-account-review>
  <div v-if="showBooking" class="col-9 date-time flex column full-height q-px-md">
    <h4 class="text-h4">  {{$t('selectDateTime.select')}}</h4>
    <div class="row" >
      <div class="col-7" id="datepicker-col">
    <q-date
      class="desktop-datepicker"
      mask="YYYY-MM-DD"
      minimal
      v-model="date"
      @input="getTiminigs"
    />
        <q-btn-dropdown color="primary" class="q-my-md" v-bind:label="getCurrentDateTime">
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-item-label>Central Euorpean Time</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <div class="col-5 flex column time-picker q-px-md justify-start items-center scroll-y">
        <p>Thursday April, 5th.</p>
        <q-btn color="purple-7"
          v-for="(time,index) in timeList"
          outline class="q-my-md"
          v-bind:key="index"
          style="width: 250px; height: 70px"
          v-bind:label="time" />

      </div>
    </div>
  </div>
  <vue-bottom-sheet ref="bottomSheet" class="mobile-time full-width">
    <div class="full-width scroll-y flex column text-center " style="height: 300px;">
      <q-btn class="text-bold full-width text-h5 q-pa-xs"  v-for="(time,index) in timeList" v-bind:key="index" v-bind:label="time"></q-btn>

    </div>
  </vue-bottom-sheet>
</q-page>
</template>

<script>

import BioComponent from 'components/profile/BioComponent'
import VueBottomSheet from '@webzlodimir/vue-bottom-sheet'
import ContactOwnerProfile from 'components/profile/ContactOwnerProfile'
import DesktopAccountReview from 'components/profile/DesktopAccountReview'
import MobileAccountReview from 'components/profile/MobileAccountReview'
export default {
  name: '_profile',
  data () {
    return {
      dialogue: false,
      showBooking: false,
      slide: 'style',
      sliderHeight: '500px',
      timeList: [],
      date: '',
      response: {
        username: 'username',
        title: 'AUBA Oversize Style',
        subtitle: '<a href="">@AUBABoutique</a>',
        following: false,
        backgroundPicture:
          'https://media.istockphoto.com/photos/background-of-mannequin-for-female-on-color-canvas-background-picture-id1094745512?k=6&m=1094745512&s=612x612&w=0&h=SC6JoW3rV5xcNI6dSmRVCNK36Sb5dZguPXFGZ3q-Rwc=',
        logo:
          'https://scontent.fpmi1-1.fna.fbcdn.net/v/t1.6435-1/p320x320/130457284_3536493656439221_3369668135175541122_n.jpg?_nc_cat=105&ccb=1-3&_nc_sid=1eb0c7&_nc_ohc=zOCWGO34XMwAX_G_eGU&_nc_oc=AQkABq4dsUUYXjA-LWeJe5vlvdny76f-tnnpOCqApQllRE4o4MpnR2M9Hrw18vyWmp8&_nc_ht=scontent.fpmi1-1.fna&tp=6&oh=ee44dec25457994e3db7d59c165f1454&oe=608886D2',
        intro:
          'The store is open, come visit us 😘 #aubaboutique #palmademallorca #womenfashion #fashionoversize #curvyfashion #spana #baleares #spring2021 #happysaturday #mallorca #fashion2021 #spring',
        location,
        online: true,
        social: [
          { type: 'twitter', url: '' },
          { type: 'facebook', url: '' },
          { type: 'instagram', url: '' },
          { type: 'whatsapp', url: '' }
        ],
        gallery: [
          'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/E1266601_%285398889640%29.jpg/1200px-E1266601_%285398889640%29.jpg',
          'https://static.onecms.io/wp-content/uploads/sites/14/2020/07/15/fashion-header-1-2000.jpg',
          'https://www.criteo.com/wp-content/uploads/2020/07/fashion-featured-image.png',
          'https://www.fbifashioncollege.com.au/wp-content/uploads/2019/11/1.jpg'
        ],
        calendar: [
          { dt: '2021-03-31T10:00:00', username: '' },
          { dt: '2021-03-31T12:00:00', username: '' },
          { dt: '2021-03-31T14:00:00', username: '' },
          { dt: '2021-04-31T11:00:00', username: '' },
          { dt: '2021-04-31T12:00:00', username: '' },
          { dt: '2021-05-31T15:00:00', username: '' }
        ],
        reviews: 124,
        followers: 3200
      }
    }
  },
  components: {
    MobileAccountReview,
    DesktopAccountReview,
    BioComponent,
    VueBottomSheet,
    ContactOwnerProfile
  },
  computed: {
    getCurrentDateTime () {
      const date = new Date()
      return `${date.toString().split('(')[1].replace(')', '')} ${date.getHours()}:${date.getMinutes()}`
    }
  },
  methods: {
    showBookingPage () {
      this.showBooking = !this.showBooking
    },
    getTiminigs (value) {
      const timings = []
      for (let i = 0; i < this.response.calendar.length; i++) {
        const temp = this.response.calendar[i].dt.split('T')[0]
        if (temp === value) {
          timings.push(this.response.calendar[i].dt.split('T')[1])
        }
      }
      this.timeList = timings
      if (window.screen.width < 881 && this.timeList.length > 0) {
        this.$refs.bottomSheet.open()
      }
    }
  }
}
</script>
<style src="src/components/profile/profile.sass" lang="sass"></style>
