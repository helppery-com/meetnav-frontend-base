<template>
  <q-card
    class="account-page"
    style="width:600px"
    >
    <q-card-section horizontal>
      <q-card-section class="q-pa-xl column items-center justify-center">
        <q-avatar size="200px" class="q-mb-md shadow-2">
          <img :src="newPhoto || user.avatar" />
        </q-avatar>
        <q-btn
          color="primary"
          class="q-mb-md"
          style="color: white"
          @click="openDialogue"
          :label="$t('Change...')"
        />
        <input
          type="file"
          id="accountImage"
          accept=".jpg, .png, .jpeg, .gif"
          @change="handleImage"
          ref="filePicker"
          style="display: none"
        />
      </q-card-section>
      <q-card-section class="full-width">
        <q-input
          v-model="user.displayName"
          :label="$t('Display name')"
          class="input q-mb-md"
          :rules="[
            (val) =>
              (val !== null && val !== '') ||
              $t('Please type your display name'),
          ]"
        />
        <!-- for password -->
        <div class="row items-center full-width justify-center">
          <q-form ref="passwordReset" class="form">
            <q-input
              v-model="oldPassword"
              :label="$t('Code or old password')"
              type="password"
              class="input q-mb-md"
              :rules="[
                (val) =>
                  (val !== null && val !== '') ||
                  $t('please type your previous password'),
              ]"
            />
            <q-input
              v-model="newPassword"
              id="newPassword"
              type="password"
              :label="$t('Enter new password')"
              class="input q-mb-md"
              :rules="[
                (val) =>
                  (val !== null && val !== '') ||
                  $t('please type your new password'),
              ]"
            />
            <q-input
              v-model="confirmPassword"
              :label="$t('Confirm new password')"
              type="password"
              class="input q-mb-md"
              :rules="[
                (val) => (val !== null && val !== '') || $t('confirm new password'),
                (val) =>
                  val === document.getElementById('newPassword').value ||
                  'passwords dont match',
              ]"
            />
            <q-btn
              type="submit"
              color="primary"
              style="color: white"
              label="Update Password"
              class="input q-mb-md"
            />
          </q-form>
        </div>
      </q-card-section>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn :label="$t('Save')" />
      <q-btn :label="$t('Cancel')" color="red"/>
    </q-card-actions>
  </q-card>
</template>
<script>
export default {
  data () {
    return {
      newPhoto: null,
      oldPassword: null,
      newPassword: null,
      confirmPassword: null,
      displayName: null
    }
  },
  computed: {
    user () {
      return this.$storex.user.user
    }
  },
  methods: {
    openDialogue () {
      this.$refs.filePicker.click()
    },
    handleImage (e) {
      this.newPhoto = URL.createObjectURL(e.target.files[0])
    }
  }
}
</script>
<style lang="sass">
  .account-page
    .input, .form
      width: 100%
</style>
