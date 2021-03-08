<template>
  <div class="q-my-md q-mx-md" v-bind:class="{'circle-image': isNotification, 'circle-notification': !isNotification}" style="position:relative;">
    <q-img
      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
      spinner-color="white"
      style="border-radius: 50%;width: 100%; height: 100%; object-fit: contain"
    />
    <div v-if="showIcons" class=" full-height flex items-center justify-end column top" style="position:absolute; ">
      <div class="flex q-mb-xs">
        <q-icon name="fiber_manual_record" style="color: red;" class="icon-size"></q-icon>
        <q-icon name="videocam" size="30px" style="color: gray" class="icon-size"></q-icon>
        <q-icon name="settings_voice" size="30px" style="color: gray" class="icon-size"></q-icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ParticipantComponent',
  props: {
    showIcons: {
      type: Boolean,
      required: true
    },
    isNotification: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped lang="sass">
.top
  top: 0
  width: 100%
.circle-notification
  width: 100px
  height: 100px
.circle-image
   height: 250px
   width: 250px
   border-radius: 50% 50%
.icon-size
  width: 30px
  height: 30px
@media screen and (max-width: 1550px)
  .circle-image
    height: 200px
    width: 200px
@media screen and (max-width: 1100px)
  .circle-image
    height: 150px
    width: 150px
@media screen and (max-width: 870px)
  .circle-image
    height: 100px
    width: 100px
@media screen and (max-width: 580px)
  .circle-image
    height: 100px
    width: 100px

</style>
