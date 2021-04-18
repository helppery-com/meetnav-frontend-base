<template>
  <q-footer class="footer bg-grey-8 ">
    <div class="footer-area">
      <div class="language-section ">
        <p class="q-ml-md">{{ $t('Language') }}</p>
        <q-btn-dropdown  size="20" ref="special" text-color="black" auto-close flat v-bind:label="selectedLanguage">
          <q-item
            v-for="(item, lang, ix) in languages" :key="ix"
            clickable
            v-close-popup @click="changeLanguage(lang)">
            <q-item-section>
              <q-item-label>{{ item }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-btn-dropdown>
      </div>
      <div class=" flex items-center justify-end" style="height: 45%">
        <site-link-component href="https://www.freepik.com" link="www.freepik.com" addPadding="true" credits="true"></site-link-component>
      </div>
    </div>
  </q-footer>
</template>

<script>
import SiteLinkComponent from 'components/SiteLinkComponent'
export default {
  name: 'shared-footer',
  data () {
    return {
      languages: {
        en: 'English',
        es: 'Español',
        hi: 'हिन्दी'
      }
    }
  },
  components: {
    SiteLinkComponent
  },
  computed: {
    selectedLanguage () {
      return this.languages[this.$storex.user.lang]
    }
  },
  methods: {
    changeLanguage (lang) {
      this.$i18n.locale = lang
      this.$storex.user.changeLanguage(lang)
    }
  }
}
</script>

<style lang="sass">
.footer
  .footer-area
    width: 100%
    height: 100px
    background-color: #edeff1

  .language-section
    width: 100%
    height: 55%
    border-bottom-style: solid
    border-bottom-width: 2px
    border-bottom-color: #d2d4d6
    color: #3a5e83

  .language-section > p
    margin-bottom: 0

@media screen and (max-width: 500px)
  .footer
    .footer-area
      width: 100%
      height: 80px
      background-color: #edeff1

    .language-section
      width: 100%
      height: 60%
      border-bottom-style: solid
      border-bottom-width: 2px
      border-bottom-color: dimgray
      color: black
</style>
