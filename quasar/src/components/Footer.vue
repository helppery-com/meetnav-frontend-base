<template>
  <q-footer  class="bg-grey-8 ">
    <div class="footer-area">
      <div class="language-section ">
        <p class="q-ml-md">Language</p>
        <q-btn-dropdown  size="20" ref="special" text-color="black" auto-close flat v-bind:label="selectedLanguage">
          <q-item clickable v-close-popup @click="changeLanguage('en')">
            <q-item-section>
              <q-item-label>English</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="changeLanguage('es')">
            <q-item-section>
              <q-item-label>Español</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="changeLanguage('in')">
            <q-item-section>
              <q-item-label>हिन्दी</q-item-label>
            </q-item-section>
          </q-item>
        </q-btn-dropdown>
      </div>
      <div class=" flex items-center justify-end" style="height: 45%">
        <span style="color: #17416c">Credits:</span> <a class="q-ml-md" style="color: #80a8b8;text-decoration: none" href="https://www.freepik.com">www.freepik.com</a>
      </div>
    </div>
  </q-footer>
</template>

<script>
export default {
  name: 'footer',
  data () {
    return {
      selectedLanguage: 'English'
    }
  },
  methods: {
    changeLanguage (lang) {
      this.$i18n.locale = lang
      this.selectedLanguage = this.$t('name')
    }
  }
}
</script>

<style scoped>
.footer-area{
  width: 100%;
  height: 100px;
  background-color: #edeff1;
}
.language-section{
  width: 100%;
  height: 55%;
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-bottom-color: #d2d4d6;
  color: #3a5e83;
}
.language-section > p {
  margin-bottom: 0;
}
@media screen and (max-width: 500px){
  .footer-area{
    width: 100%;
    height: 80px;
    background-color: #edeff1;
  }
  .language-section{
    width: 100%;
    height: 60%;
    border-bottom-style: solid;
    border-bottom-width: 2px;
    border-bottom-color: dimgray;
    color: black;
  }
}
</style>
