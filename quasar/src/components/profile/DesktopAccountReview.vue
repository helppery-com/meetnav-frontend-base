<template>
  <div class="col-3 overview column full-height q-px-lg desktop-time">
    <q-avatar size="180px" rounded>
      <img v-bind:src="getLogo" class="circle-border"/>
    </q-avatar>
    <p class="text-h4 ">{{$t('selectDateTime.accountReview')}}</p>
    <p class="text-h6"><span><q-icon name="timer" size="20px"></q-icon>  45 min</span></p>
    <p>{{$t('selectDateTime.description')}}</p>
  </div>
</template>

<script>
export default {
  name: 'DesktopAccountReview',
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
