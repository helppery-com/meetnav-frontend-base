<template>
  <div class="full-width bg-grey" style="height: 5px; position: relative">
    <!--  red seekbar    -->
    <div class="full-height bg-red" style="top: 0; z-index: 3; position: absolute" id="redseekBar"></div>
    <!--  ADS markers    -->
    <div class="full-height bg-yellow addMarker" style="left: 25%"></div>
    <div class="full-height bg-yellow addMarker" style="left: 50%"></div>
    <div class="full-height bg-yellow addMarker" style="left: 75%"></div>

  </div>
</template>

<script>
export default {
  name: 'SeekBar'
}
</script>

<style scoped lang="sass">
.addMarker
  z-index: 10
  width: 20px
  top:0
  position: absolute
</style>
