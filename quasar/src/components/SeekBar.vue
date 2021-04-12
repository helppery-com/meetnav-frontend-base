<template>
  <div class="column">
    <div class="col">
      <div class="seek-bar full-width bg-grey" style="height: 5px; position: relative">
      <!--  red seekbar    -->
      <div class="full-height bg-red" style="top: 0; z-index: 3; position: absolute" id="redseekBar"></div>
      <!--  ADS markers    -->
      <div class="full-height bg-yellow addMarker" style="left: 25%"></div>
      <div class="full-height bg-yellow addMarker" style="left: 50%"></div>
      <div class="full-height bg-yellow addMarker" style="left: 75%"></div>
      <a
        href="https://github.com/nurdism/neko"
        target="_blank"
        class="watermark">
        <img
          title="powered by neko!"
          src="https://raw.githubusercontent.com/nurdism/neko/master/docs/_media/logo.png"
        />
      </a>
    </div>
    </div>
    <div class="q-pl-md col-auto">
      {{ '00:00:01 / 01:00:00' }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'SeekBar'
}
</script>

<style lang="sass">
.seek-bar
  .addMarker
    z-index: 10
    width: 20px
    top:0
    position: absolute
  .watermark
    display: none
    position: absolute
    left: 10px
    bottom: 20px
    img
      width: 60px
</style>
