<template>
  <div class="result-helpper-connect flex full-width q-pa-sm">
    <div class="flex full-width justify-around items-center">
      <q-img
        :src="getAvatar"
        spinner-color="purple-7"
        img-class="img-circles"
        style=" width: 50px; height: 50px;border-radius: 50% 50%; border-width: 2px; border-style: solid; border-color: white; transform: translateX(0px)"
      />
      <div class="rating-username" >
        <div class="ellipsis main-heading text-subtitle1">{{getUsername}}</div>
        <div class="flex">
          <q-btn color="green" no-caps  text-color="text-white" size="10px" rounded="rounded" unelevated class="q-ma-xs" icon-right="local_fire_department" v-bind:label="$t('welcomePage.tags.a')" />
          <q-rating
            name="quality"
            v-model="getRating"
            max="5"
            size="1.5em"
            color="yellow"
            icon="star_border"
            icon-selected="star"
            readonly
            no-dimming
          />
        </div>
      </div>
      <q-btn color="primary" style="color: white; height: 40px" label="Connect" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResultPeopleConnectItem',
  props: ['username', 'avatar', 'rating'],
  data () {
    return {
      url: 'https://placeimg.com/500/300/nature',
      quality: 4
    }
  },
  computed: {
    getUsername () {
      return this.username
    },
    getAvatar () {
      return this.avatar
    },
    getRating () {
      return Number.parseFloat(this.rating)
    }
  }
}
</script>

<style lang="sass">
.result-helpper-connect
  .main-heading
    color: #3d7094
    font-weight: 700

  .rating-username
    width: 60%
    height: 50px
    flex-wrap: nowrap

@media screen and (max-width: 450px)
  .result-helpper-connect
    .rating-username
      width: 50%
      height: 70px
</style>
