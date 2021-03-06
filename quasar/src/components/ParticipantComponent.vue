<template>
  <div class=" circle-image q-my-md" style="position:relative;">
    <q-img
      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
      spinner-color="white"
      v-bind:style="{width: this.width, height: this.height}"
      style="width: 100px; height: 100px; border-radius: 50%"
    />
    <div v-if="showIcons" class="full-width full-height flex items-center justify-end column" style="position:absolute; top: 0">
      <div class="flex q-mb-xs">
        <q-icon name="fiber_manual_record" style="color: red;" size="30px"></q-icon>
        <q-icon name="videocam" size="30px" style="color: gray"></q-icon>
        <q-icon name="settings_voice" size="30px" style="color: gray"></q-icon>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ParticipantComponent',
  props: {
    width: {
      type: String,
      required: true
    },
    height: {
      type: String,
      required: true
    },
    showIcons: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
