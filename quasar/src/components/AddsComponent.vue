<template>
  <div
       class="absolute flex items-center justify-end column full-width "
       style="bottom: 0; height: 170px;">
    <div class="ads bg-yellow q-mb-md">
      <q-img
        v-bind:src="getAddContent"
        style="width: 100%; height: 100%; object-fit: contain"
      ></q-img>
      <div class="close bg-white flex items-center justify-center cursor-pointer" @click="closeAds">
        <q-icon name="close" size="20px"></q-icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddsComponent',
  props: {
    addContent: {
      type: String,
      required: true
    }
  },
  computed: {
    getAddContent () {
      return this.addContent
    }
  },
  methods: {
    closeAds () {
      this.$emit('CloseAds')
    }
  }
}
</script>

<style scoped lang="sass">
.close
  position: absolute
  top: 0
  right: 0
  width: 30px
  height: 30px
.ads
  width: 500px
  height: 150px
  position: relative
@media screen and (max-width: 615px)
  .ads
    width: 250px
    height: 100px
    position: relative
</style>
