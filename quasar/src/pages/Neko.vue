<template>
  <q-page class="neko-page">
    <NekoVideo />
  </q-page>
</template>
<script>
import NekoVideo from '../components/neko/NekoVideo'
export default {
  components: {
    NekoVideo
  }
}
</script>
<style lang="sass">
  .neko-page
    display: grid
</style>
