<template>
  <q-page class="home-page full-width flex adjusted-height overflow-hidden">
    <div class="parent-sections q-px-xl">
      <!-- text section -->
      <div class="col wrap  full-height column justify-center items-center">
        <!--  Heading section  -->
        <div class="q-mx-lg caption">
          <p class="text-h3">{{ $t('homePage.mainHeading') }}</p>
          <p class="text-h5">{{ $t('homePage.subHeading') }}</p>
          <!--  caption  -->
          <p class="text-h6 text-grey-6" >{{ $t('homePage.caption') }}</p>
          <!--   navigation links   -->
          <div class="row justify-between q-mt-xl navigation-links" >
            <q-btn
              color="accent"
              class="col float-left q-ma-xs ref-start-navroom"
              size="19px"
              icon="video_call"
              v-bind:label="$t('homePage.navigateTogether')"
              square
              :disabled="!canCreateRoom"
              @click="newRoom('standard')"
            >
              <q-menu fit
                anchor="center middle"
                self="center middle"
                v-if="false"
              >
                <q-list style="min-width: 100px">
                  <q-item clickable v-close-popup @click="openMyRoom">
                    <q-item-section avatar>
                      <q-avatar icon="account_circle" color="accent" text-color="white" />
                    </q-item-section>
                    <q-item-section class="text-h6 text-accent">
                      {{ $t('My room') }}
                    </q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item v-for="(item, ix) in templates" :key="ix" clickable v-close-popup @click="newRoom(item.name)">
                    <q-item-section avatar>
                      <q-avatar :icon="item.icon" color="dark" text-color="white" v-if="item.icon" />
                      <q-avatar v-else>
                        <img :src="item.image" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section class="text-h6">
                      {{ templateName(item) }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            <q-input
              v-bind:placeholder="$t('homePage.enterCode')"
              class="col float-right q-ma-xs ref-navroom-code"
              outlined
              size="24px"
              v-model="code"
              @keypress.enter="openNavroom"
            >
              <template v-slot:prepend>
                <q-icon name="keyboard" />
              </template>
              <template v-slot:append>
                <q-btn flat icon="cast" v-if="code" @click="openNavroom" class="ref-join-navroom"/>
              </template>
            </q-input>
          </div>
          <div class="q-py-md">
            <q-btn outline
              rounded
              v-for="(room, ix) in openRooms" :key="ix"
              @click="$router.push(`/navroom/${room.roomId}`)"
              icon="cast"
              :label="room.roomId"
              class="q-mr-xs"
            />
          </div>
          <hr class="q-mt-lg">
          <p class="q-mt-lg sm-hide xs-hide" >
            <span class="text-purple-7">
              {{ $t('homePage.learnMore') }}
            </span>
            <a href="https://web.meetnav.com/">{{ $t('homePage.about') }} meetnav</a>
          </p>
        </div>
      </div>
      <!-- carousel section -->
      <div class="col full-height column justify-end items-center">
        <q-carousel
          v-model="slide"
          swipeable
          animated
          navigation-position="bottom"
          navigation
          padding
          class="fit rounded-borders"
          control-color="grey-8"
          :autoplay="10000"
          infinite
        >
          <q-carousel-slide
            class="column no-wrap flex-center"
            v-for="(slice, ix) in carousel" :key="ix"
            :name="slice.title"
            >
            <img
              :src="slice.img"
              class="q-mt-md"
            />
            <div class="text-center " style="margin-top: 50px; width: 350px">
              <span class="text-h5">{{ $t(slice.title) }}</span>
              <p>{{ $t(slice.desc) }}</p>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
    </div>
    <p class="q-mt-lg q-ml-md md-hide lg-hide xl-hide" ><span class="text-purple-7"> {{ $t('homePage.learnMore') }} </span> {{ $t('homePage.about') }} meetnav</p>
  </q-page>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      slide: 'meetnav',
      code: '',
      templates: [],
      carousel: [{
        img: 'https://web.meetnav.com/web/image/317-61f61eab/meetnav_travel.png',
        title: 'meetnav',
        desc: 'Meet and navigate internet together!'
      },
      {
        img: 'https://web.meetnav.com/web/image/299-ccad1279/meetnav_shopping.png',
        title: 'Shopping',
        desc: 'Call your fiends and go online shopping together!'
      },
      {
        img: 'https://web.meetnav.com/web/image/300-0ee821cc/meetnav_social.png',
        title: 'Socializing',
        desc: 'Enjoy meeting and going social. Comment, share, discover.'
      },
      {
        img: 'https://web.meetnav.com/web/image/301-2e6b8168/meetnav_kids.png',
        title: 'Learning',
        desc: 'he best way for the new internet users to navigate internet in safe and funny way.'
      }]
    }
  },
  async created () {
    this.templates = await this.$storex.room.nekoTemplates
  },
  computed: {
    user () {
      return this.$storex.user.user
    },
    canCreateRoom () {
      return this.user && !this.$isGuest
    },
    openRooms () {
      return this.$storex.room.nekoRooms
    }
  },
  methods: {
    openMyRoom () {
      if (this.canCreateRoom) {
        this.$router.push({ path: `/navroom/@${this.user.username}` })
      }
    },
    newRoom (template) {
      if (!this.canCreateRoom) {
        if (this.$isGuest) {
          this.$q.notify(this.$t('Guest users can\'t create rooms'))
        }
        this.$root.$once('user-logged', () => this.newRoom())
        return this.$root.$emit('login')
      }
      this.$router.push({ path: '/navroom', query: { template } })
    },
    openNavroom () {
      if (this.code) {
        this.$router.push(`/navroom/${this.code}`)
      }
    },
    templateName (tpl) {
      const language = this.$storex.user.lang
      const translation = tpl.translations.filter(t => t.language === language)[0]
      return translation ? translation.translation : this.$t(tpl.name)
    }
  }
}
</script>

<style lang="sass">
.home-page
  .adjusted-height
    height: calc(100vh - 80px)

  .parent-sections
    height: 100%
    display: flex
    flex-direction: row
    align-items: center
    justify-content: center
    flex-grow: 1

  .caption
    text-align: left

  .navigation-links
    max-width: 600px

  .q-carousel
    img
      width: 550px

@media screen and (max-width: 1023px)
  .home-page
    .parent-sections
      height: fit-content
      width: 100%
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      flex-grow: 1

    .caption
      text-align: center

    .adjusted-height
      height: fit-content
      margin-top: 10px

    .navigation-links > *
      width: 100%

    .text-h3
      font-size: 2.5rem
      font-weight: 400
      line-height: 3.125rem
      letter-spacing: normal

    .q-carousel
      img
        width: 350px
</style>
