<template>
  <q-card class="bg-white text-primary" style="width: 600px">
    <q-card-section>
      <div class="text-h5">
        {{ $t('Leave room') }}
      </div>
    </q-card-section>

    <q-card-section class="bg-white">
      <div class="text-h6">{{ $t('How was your experience') }}</div>
      <q-rating
        v-model="rating"
        max="4"
        size="3em"
        color="yellow"
        icon="star_border"
        icon-selected="star"
        icon-half="star_half"
        no-dimming
      />
    </q-card-section>

    <q-card-actions align="right" class="bg-white text-teal">
      <q-btn outline color="accent" :label="$t('Exit room')" v-close-popup @click="closeRoom"/>
      <q-btn outline color="red" :label="$t('Close room')" v-close-popup @click="closeRoom(true)" v-if="false" />
      <q-btn outline :label="$t('Back')" v-close-popup />
    </q-card-actions>
  </q-card>
</template>
<script>
export default {
  computed: {
    isRoomAdmin () {
      return this.$storex.room.room && this.$storex.room.room.isAdmin
    }
  },
  methods: {
    justLeave () {
      this.$router.push('/')
    },
    closeRoom (close) {
      this.$storex.room.closeLiveRoom(close)
      this.justLeave()
    }
  }
}
</script>
