// import something here

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
import VueI18n from 'vue-i18n'
import { translations } from '../translations/translation'
import Vue from 'vue'

Vue.use(VueI18n)
const i18n = new VueI18n(
  {
    locale: 'es',
    fallbackLocale: 'es',
    messages: translations
  }
)
export default ({ app, Vue, router }) => {
  i18n.locale = Vue.prototype.$storex.user.lang
  app.i18n = i18n

  router.beforeEach((to, from, next) => {
    try {
      const { lang } = to.query
      if (lang) {
        app.i18n.locale = lang
        Vue.prototype.$storex.user.changeLanguage(lang)
      }
    } catch {}
    next()
  })
}

export { i18n }
