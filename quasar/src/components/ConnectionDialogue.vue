<template>
  <q-dialog persistent v-model="dialog" position="top">
    <q-card class="card-connection">
      <q-card-section class="row items-center full-height full-width no-wrap">
          <!--    user image    -->
        <div class="col-3 row items-center justify-center full-height">
          <participant-component v-bind:show-icons="showIcons" v-bind:is-notification="isNotification"></participant-component>
        </div>
        <div class="col-9">
          <span class="text-h4">{{$t('connectionRequest.newRequest')}}</span>
          <p class="text-h6">Beth {{$t('connectionRequest.waiting')}}</p>
          <div class="row justify-end items-center">
            <q-btn color="white" text-color="pink-7" @click="closeDialogue" class="q-mr-xs" v-bind:label="$t('connectionRequest.join')" />
            <q-btn color="white" text-color="gray-7" class="q-mr-xs" v-bind:label="$t('connectionRequest.cancel')" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import ParticipantComponent from 'components/ParticipantComponent'

export default {
  name: 'ConnectionDialogue',
  data () {
    return {
      dialog: true,
      showIcons: false,
      isNotification: false
    }
  },
  components: {
    ParticipantComponent
  },
  methods: {
    closeDialogue () {
      this.$emit('continue')
      this.dialog = false
    }
  }
}
</script>

<style scoped lang="sass">
.card-connection
  width: 600px
  height: 150px
  margin-top: 30px
</style>
