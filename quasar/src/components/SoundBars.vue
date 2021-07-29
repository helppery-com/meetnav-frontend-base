<template>
  <div :class="['sound-bars', speaking ? '' : 'paused', muted ? 'muted' : '']">
    <div class="bar small"></div>
    <div class="bar normal"></div>
    <div class="bar normal"></div>
    <div class="bar small"></div>
  </div>
</template>
<script>
export default {
  props: ['sound', 'muted'],
  data () {
    return {
      speaking: false,
      pauseTout: null
    }
  },
  watch: {
    sound (val) {
      if (val) {
        clearTimeout(this.pauseTout)
        this.speaking = true
      } else {
        this.pauseTout = setTimeout(() => { this.speaking = false }, 200)
      }
    }
  }
}
</script>
<style lang="sass">
.sound-bars
  height: 30px
  width: 30px
  position: relative

  .bar
    background: white
    bottom: 1px
    position: absolute
    width: 6px
    border-radius: 3px
    &.normal
      animation: sound 0ms -800ms linear infinite alternate
      animation-duration: 833ms
    &.small
      animation: soundsmall 0ms -800ms linear infinite alternate
      animation-duration: 474ms

  &.paused
    .bar
      animation: soundoff 0ms -800ms linear
      height: 5px
      background: gainsboro
  &.muted
    .bar
      background: $dark

@keyframes sound
  0%
      opacity: .35
      height: 3px

  100%
      opacity: 1
      height: 22px

@keyframes soundsmall
  0%
      opacity: .35
      height: 3px

  100%
      opacity: 1
      height: 12px

@keyframes soundoff
  0%
      opacity: 1

  100%
      opacity: 1
      height: 3px

.bar:nth-child(1)
  left: 0px
.bar:nth-child(2)
  left: 8px
.bar:nth-child(3)
  left: 16px
.bar:nth-child(4)
  left: 24px
</style>
