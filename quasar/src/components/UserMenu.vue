<template>
  <q-icon color="primary" name="menu">
    <q-menu>
      <q-list style="min-width: 100px">
        <q-item clickable v-ripple @click="editStyle = true" v-if="isAdmin">
          <q-item-section avatar>
            <q-icon color="primary" name="settings" />
          </q-item-section>
          <q-item-section>{{ $t('Settings') }}</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="$router.push('/')">
          <q-item-section avatar>
            <q-icon color="primary" name="exit" />
          </q-item-section>
          <q-item-section>{{ $t('Leave') }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
    <q-dialog v-model="editStyle" v-if="connected">
      <q-card class="my-card" style="width: 1200px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{ $t('Settings') }}</div>
        </q-card-section>
        <SessionSettings :settings="sessionSettings"/>
        <q-card-actions align="right">
          <q-btn flat :label="$t('Save')" @click="saveSessionSettings" v-close-popup/>
           <q-btn flat color="red" :label="$t('Reset')" v-close-popup/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-icon>
</template>
<script>
import SessionSettings from '../components/SessionSettings'

export default {
  components: {
    SessionSettings
  },
  data () {
    return {
      editStyle: false,
      sessionSettings: {
        photo: 'https://static.thenounproject.com/png/778835-200.png'
      }
    }
  },
  computed: {
    connected () {
      return this.$storex.room.connected
    },
    isAdmin () {
      return this.$storex.room.isAdmin
    }
  },
  methods: {
    saveSessionSettings () {
      this.$storex.room.setRoomStyle(this.sessionSettings.style)
    }
  }
}
</script>
