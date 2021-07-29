<template>
  <div class="dish" ref="dish">
    <div
      class="camera"
      :style="{
        width: getWidth(),
        margin: getMargin(),
        height: getHeight(),
      }"
      v-for="(camera, ix) in cameras" :key="ix"
    >
      <slot name="camera" v-bind:camera="camera"/>
    </div>
  </div>
</template>
<script>
// https://github.com/Alicunde/Videoconference-Dish-CSS-JS
export default {
  props: ['cameras'],
  data () {
    return {
      width: null,
      onResize: null
    }
  },
  mounted () {
    this.dish()
    this.onResize = this.dish.bind(this)
    window.addEventListener('resize', this.onResize)
  },
  destroyed () {
    window.removeEventListener('resize', this.onResize)
  },
  watch: {
    cameras () {
      setTimeout(() => this.dish(), 100)
    }
  },
  methods: {
    getWidth () {
      return this.width ? `${this.width}px` : '100%'
    },
    getMargin () {
      return '2px'
    },
    getHeight () {
      return this.width ? `${this.width * 0.75}px` : '100%'
    },
    area (increment, count, width, height, margin) {
      let i = 0
      let w = 0
      let h = increment * 0.75 + margin * 2
      while (i < count) {
        if (w + increment > width) {
          w = 0
          h = h + increment * 0.75 + margin * 2
        }
        w = w + increment + margin * 2
        i++
      }
      if (h > height) {
        return false
      }
      return increment
    },
    dish () {
      const margin = 2
      const scenary = this.$refs.dish
      const width = scenary.offsetWidth - margin * 2
      const height = scenary.offsetHeight - margin * 2
      let max = 0

      // loop (i recommend you optimize this)
      let i = 1
      while (i < 5000) {
        const w = this.area(i, this.cameras.length, width, height, margin)
        if (w === false) {
          max = i - 1
          break
        }
        i++
      }
      // set styles
      max = max - margin * 2
      this.width = max
    }
  }
}
</script>
<style lang="sass">
  .dish
    display: flex
    align-content: flex-start
    flex-wrap: wrap
    align-items: center
    justify-content: center
    vertical-align: middle
    position: absolute
    left: 0px
    bottom: 0px
    top: 0px
    right: 0px

    .camera
      position: relative
      vertical-align: middle
      align-self: center
      overflow: hidden
      display: inline-block
      animation: show 0.4s ease
</style>
