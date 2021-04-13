<template>
  <q-page class="full-width flex adjusted-height overflow-hidden">
    <div class="parent-sections ">
      <!-- text section -->
      <div class="col wrap  full-height column justify-center items-center">
        <!--  Heading section  -->
        <div class="q-mx-lg caption" style="max-width: 600px;">
          <p class="text-h3">{{ $t('homePage.mainHeading') }}</p>
          <p class="text-h3">{{ $t('homePage.subHeading') }}</p>
          <!--  caption  -->
          <p class="text-h6 text-grey-6" >{{ $t('homePage.caption') }}</p>
          <!--   navigation links   -->
          <div class="row justify-between q-mt-xl navigation-links" >
            <q-btn
              color="purple-7"
              class=" float-left q-ma-sm"
              size="19px"
              icon="video_call"
              v-bind:label="$t('homePage.navigateTogether')"
              square
            />
            <q-input
              v-bind:placeholder="$t('homePage.enterCode')"
              class=" float-right q-ma-sm"
              outlined
              size="24px"
            >
              <template v-slot:prepend>
                <q-icon name="keyboard" />
              </template>
            </q-input>
          </div>
          <hr class="q-mt-lg">
          <p class="q-mt-lg sm-hide xs-hide" ><span class="text-purple-7"> {{ $t('homePage.learnMore') }} </span> {{ $t('homePage.about') }} meetnav</p>
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
          height="650px"
          class=" rounded-borders"
          control-color="grey-8"
          :autoplay="true"
          infinite
        >
          <q-carousel-slide name="style" class="column no-wrap flex-center">
            <q-img
              src="https://images.unsplash.com/photo-1611095788646-86737a001141?ixid=MXwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              class="q-mt-md"
              style="width: 500px; height: 650px"
            />
            <div class="text-center " style="margin-top: 50px; width: 350px">
              <span class="text-h5">{{ $t('homePage.carouselHeading') }}</span>
              <p>{{ $t('homePage.carouselHeadingCaption') }}</p>
            </div>
          </q-carousel-slide>
          <q-carousel-slide name="tv" class="column no-wrap flex-center">
            <q-img
              src="https://images.unsplash.com/photo-1611095788646-86737a001141?ixid=MXwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              class="q-mt-md"
              style="width: 500px; height: 650px"
            />
            <div class="text-center " style="margin-top: 50px; width: 350px">
              <span class="text-h5">{{ $t('homePage.carouselHeading') }}</span>
              <p>{{ $t('homePage.carouselHeadingCaption') }}</p>
            </div>
          </q-carousel-slide>
          <q-carousel-slide name="pc" class="column no-wrap flex-center">
            <q-img
              src="https://images.unsplash.com/photo-1611095788646-86737a001141?ixid=MXwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              class="q-mt-md"
              style="width: 500px; height: 650px"
            />
            <div class="text-center " style="margin-top: 50px; width: 350px">
              <span class="text-h5">{{ $t('homePage.carouselHeading') }}</span>
              <p>{{ $t('homePage.carouselHeadingCaption') }}</p>
            </div>
          </q-carousel-slide>
          <q-carousel-slide name="linux" class="column no-wrap flex-center">
            <q-img
              src="https://images.unsplash.com/photo-1611095788646-86737a001141?ixid=MXwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              class="q-mt-md"
              style="width: 500px; height: 650px"
            />
            <div class="text-center " style="margin-top: 50px; width: 350px">
              <span class="text-h5">{{ $t('homePage.carouselHeading') }}</span>
              <p>{{ $t('homePage.carouselHeadingCaption') }}</p>
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
      slide: 'style'
    }
  }
}
</script>

<style scoped lang="sass">
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

@media screen and (max-width: 1023px)
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
</style>
