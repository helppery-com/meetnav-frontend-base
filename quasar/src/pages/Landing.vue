<template>
  <q-page class="landing-page full-width flex adjusted-height overflow-hidden q-pa-xl">
    <div class="text-h1">{{ landing }}</div>
  </q-page>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
    }
  },
  computed: {
    landing () {
      const name = this.$route.params.landing
      return this.$t(name)
    }
  },
  methods: {
  }
}
</script>

<style lang="sass">
</style>
