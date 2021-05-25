<template>
  <div class="q-pa-md" style="max-width: 400px">
    <q-form
      @submit="onSubmit"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="email"
        :label="$t('Your email')"
        :hint="$t('Please write your email')"
        lazy-rules
        :rules="emailRule"
      />

      <q-toggle v-model="accept" :label="$t('I accept the license and terms')" />

      <div>
        <q-btn label="Submit" type="submit" color="primary"/>
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
    <GuestLogin />
  </div>
</template>
<script>
const emailRe = /^(([^<>()[\].,;:\s@"]+(.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/i
import GuestLogin from '../components/GuestLogin'

export default {
  components: {
    GuestLogin
  },
  data () {
    return {
      email: '',
      accept: false
    }
  },
  computed: {
    emailRule () {
      return [val => (val && emailRe.exec(val)) || this.$t('Invalid email format')]
    }
  },
  methods: {
    onSubmit () {
    },
    onReset () {
      this.email = ''
      this.accept = false
    }
  }
}
</script>
