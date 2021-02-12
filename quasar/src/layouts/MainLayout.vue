<template>
  <q-layout view="hHh lpR fFf" >

    <q-header class="main-header bg-primary">
      <q-btn
        type="submit"
        v-bind:label="$t('welcomePage.login')"
        class="q-mt-md nav-button"
        color="indigo-10"
      >
        <template v-slot:loading>
          <q-spinner
            color='primary'
            size="3em"
          />
        </template>
      </q-btn>
      <q-btn
        type="submit"
        v-bind:label="$t('welcomePage.signup')"
        class="q-mt-md nav-button"
        color="blue-grey-7"
      >
        <template v-slot:loading>
          <q-spinner
            color="primary"
            size="3em"
          />
        </template>
      </q-btn>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
   <Footer @languageChange = "changeLanguage"></Footer>
  </q-layout>
</template>

<script>
import Footer from 'components/Footer'
export default {
  data () {
    return {
      selectedLanguage: 'English'
    }
  },
  components: {
    Footer
  }
}
</script>
<style scoped>
.main-header{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: transparent;
}
.nav-button{
  margin-right: 10px;
}
.language-section > p{
  font-size: 12px;
  margin-bottom: 0;
}
</style>
