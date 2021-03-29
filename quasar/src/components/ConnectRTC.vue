<template>
  <q-card>
    <q-card-section>
    </q-card-section>
    <q-card-actions>
      <q-btn color="primary"
    </q-card-actions>
  </q-card>
</template>
<script>
export default {
  props: ['roomId'],
  created () {
    this.$storex.room.initRTC(this.roomId)
  }
}
</script>