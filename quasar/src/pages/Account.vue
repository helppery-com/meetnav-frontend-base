<template>
    <q-page class="full-width full-height column items-center justify-center">
             <q-avatar size="200px" class="q-mb-md" v-if="newPhoto === null">
            <img :src="avatar">
          </q-avatar>
             <q-avatar size="200px" class="q-mb-md" v-else>
            <img :src="newPhoto">
          </q-avatar>
          <q-btn color="primary" class="q-mb-md" style="color: white" @click="openDialogue" label="Change Profile picture " />
          <input type="file" id="accountImage" accept=".jpg, .png, .jpeg, .gif" @change="handleImage" style="display:none">
          <!-- for display name change -->
           <div class="row items-center full-width justify-center">
          <q-form ref="displayName" class="form">
            <q-input
            v-model="displayName"
            label="look more cool with display name"
            class="input q-mb-md"
            :rules="[
            val => val !== null && val !== '' || $t('Please type your display name')
            ]"
            />
            <q-btn
            type="submit"
            style="color: white"
            label="Update Display Name"
            class="input q-mb-md"
            color="primary"
            @click="updateDisplayName"
            />
            </q-form>
            </div>
          <!-- for password -->
          <div class="row items-center full-width justify-center">
          <q-form ref="passwordReset" class="form">
           <q-input
            v-model="oldPassword"
            label="Enter yoru old password"
            type="password"
            class="input q-mb-md"
            :rules="[
            val => val !== null && val !== '' || $t('please type your previous password')
            ]"
             />
            <q-input
             v-model="newPassword"
             id="newPassword"
             type="password"
            label="Enter new password"
            class="input q-mb-md"
            :rules="[
            val => val !== null && val !== '' || $t('please type your new password')
            ]"
            />
            <q-input
            v-model="confirmPassword"
            label="Confirm new password"
            type="password"
            class="input q-mb-md"
            :rules="[
            val => val !== null && val !== '' || $t('confirm new password'),
            val => val === document.getElementById('newPassword').value || 'passwords dont match'
            ]"
            />
            <q-btn type="submit" color="primary" style="color: white" label="Update Password" class="input q-mb-md"/>
            </q-form>
            </div>
    </q-page>
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
    avatar: {
      get: function () {
        return this.$storex.user.user.avatar
      }
    }
  },
  methods: {
    openDialogue () {
      document.getElementById('accountImage').click()
    },
    handleImage (e) {
      this.newPhoto = URL.createObjectURL(e.target.files[0])
    },
    updateDisplayName () {
      this.$refs.displayName.validate().then(success => {
        console.log(success)
      })
    }
  }
}
</script>
<style scoped lang="sass">
.input
  width: 100%
.form
  flex-basis: 600px
</style>
