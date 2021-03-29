<template>
  <div class="commercial-video">
    <video @ended="$emit('end', video)" autoplay muted>
     <source :src="video" />
    </video>
  </div>
</template>
<script>
const commercialVideos = [
  'https://lp.cdnpromo.com/wp-content/uploads/2019/01/eCommerce_1.webm',
  'https://lp.cdnpromo.com/wp-content/uploads/2019/01/Travel_1.webm',
  'https://lp.cdnpromo.com/wp-content/uploads/2019/01/Real_estate_2.webm',
  'https://lp.cdnpromo.com/wp-content/uploads/2019/01/Real_estate_1.webm',
  'https://lp.cdnpromo.com/wp-content/uploads/2019/01/General_sale_1.webm',
  'https://lp.cdnpromo.com/wp-content/uploads/2019/01/Fitness_2.webm',
  'https://lp.cdnpromo.com/wp-content/uploads/2019/01/Fitness_1.webm',
  'https://lp.cdnpromo.com/wp-content/uploads/2019/02/Beauty_1-310.webm',
  'https://lp.cdnpromo.com/wp-content/uploads/2019/01/eCommerce_1.webm',
  'https://lp.cdnpromo.com/wp-content/uploads/2019/01/Travel_1.webm',
  'https://lp.cdnpromo.com/wp-content/uploads/2019/01/Real_estate_2.webm',
  'https://lp.cdnpromo.com/wp-content/uploads/2019/01/Real_estate_1.webm',
  'https://lp.cdnpromo.com/wp-content/uploads/2019/01/General_sale_1.webm',
  'https://lp.cdnpromo.com/wp-content/uploads/2019/01/Fitness_2.webm',
  'https://lp.cdnpromo.com/wp-content/uploads/2019/01/Fitness_1.webm',
  'https://lp.cdnpromo.com/wp-content/uploads/2019/02/Beauty_1-310.webm',
  'https://lp.cdnpromo.com/wp-content/uploads/2019/01/eCommerce_1.webm'
]
export default {
  data () {
    return {
      video: this.getRandomVideo()
    }
  },
  methods: {
    getRandomVideo () {
      const ix = Math.floor(Math.random() * Math.floor(commercialVideos.length))
      return commercialVideos[ix]
    }
  }
}
</script>
<style lang="sass">
  .commercial-video
    video
      width: 100%
</style>
