<template>
  <div class="full-width q-pa-md flex justify-center items-center" style="height: fit-content">
    <q-avatar  size="150px" rounded>
      <img v-bind:src="getLogo" class="circle-border">
    </q-avatar>
    <div class="full-height q-ml-md ">
      <div class="text-h3">{{getTitle}}</div>
      <div class="text-weight-thin text-subtitle1" v-html="getSubtitle"> </div>
      <q-btn color="blue" icon="" class="full-width q-mt-md" label="Follow" />
    </div>
    <p class="q-mt-md text-h5" style="max-width: 600px; text-align: center;">{{getIntro}}</p>
  </div>
</template>

<script>
export default {
  name: 'BioComponent',
  props: ['title', 'subtitle', 'intro', 'logo'],
  computed: {
    getTitle () {
      return this.title
    },
    getSubtitle () {
      return this.subtitle
    },
    getIntro () {
      return this.intro
    },
    getLogo () {
      return this.logo
    }
  }
}
</script>

<style scoped lang="sass">
@media screen and (max-width: 1260px)
  .text-h5
    font-size: 1.2rem
  .text-h3
    font-size: 2rem
</style>
