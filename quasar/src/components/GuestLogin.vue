<template>
  <div>
    <Login style="display: none" />
    <q-dialog v-model="openLoginDialog"
      persistent transition-show="scale"
      transition-hide="scale"
      >
      <q-card
        class="q-gutter-y-sm q-pa-xl bg-accent text-white"
        style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <q-icon name="account_circle" color="white" size="100px" />
        </q-card-section>
        <q-card-section>
          <div class="text-h3">{{ $t('Welcome') }}</div>
          <q-input
              name='username'
              v-model="username"
              :label="$t('Display name')"
              bg-color="white"
              filled
            />
        </q-card-section>
        <q-card-section class="row">
          <q-btn class="col" color="primary" :label="$t('Guest')"
          :disabled="!username"
          @click="onGuest" />
          <q-btn class="col q-ml-xl" color="white"
            outline
            icon="account_circle"
            :label="$t('Login with my account')"
            @click="onLogin" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import Login from '../components/Login'
export default {
  components: {
    Login
  },
  data () {
    return {
      openLoginDialog: true,
      username: ''
    }
  },
  created () {
    this.$root.$once('user-logged', () => this.close())
  },
  methods: {
    onGuest () {
      this.$root.$emit('login', { username: 'guest', password: 'guest', displayName: this.username })
    },
    onLogin () {
      this.$root.$emit('login')
      this.close()
    },
    close () {
      this.openLoginDialog = false
    }
  }
}
</script>
