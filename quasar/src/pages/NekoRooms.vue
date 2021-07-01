<template>
  <q-page class="nekorooms-page row">
    <NekoRooms class="col-auto"/>
    <div class="col-auto">
      <iframe class="fit" :src="`/navroom/${room.roomId}?incognito=true`" />
    </div>
  </q-page>
</template>
<script>
import NekoRooms from '../components/NekoRooms.vue'

export default {
  components: {
    NekoRooms
  }
}
</script>
<style lang="sass">
  .nekorooms-page
    iframe
      border: none
</style>
