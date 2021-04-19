<template>
  <div class="overview inline flex justify-around mobile-time no-wrap">
    <q-avatar size="100px" rounded >
      <img v-bind:src='getLogo' class="circle-border"/>
    </q-avatar>
    <div style="max-width: 300px" >
      <p class="text-h6"><span><q-icon name="timer" size="20px"></q-icon>  45 min</span></p>
      <p>{{$t('selectDateTime.description')}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MobileAccountReview',
  props: ['logo'],
  computed: {
    getLogo () {
      return this.logo
    }
  }
}
</script>

<style scoped>

</style>
