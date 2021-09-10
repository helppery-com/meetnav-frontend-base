// import something here

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
import VueI18n from 'vue-i18n'
import { translations } from '../translations/translation'
import Vue from 'vue'

function getNavigatorLanguage () {
  try {
    const lang = navigator.language
    if (lang in translations) {
      return lang
    }
  } catch {}
  return 'en'
}

Vue.use(VueI18n)
const navLanguage = getNavigatorLanguage()
function missingHandler (locale, key) {
  console.log('Missing translation', locale, key)
  return key
}
const i18n = new VueI18n({
  locale: navLanguage,
  fallbackLocale: navLanguage,
  messages: translations
})

i18n.missing = missingHandler

export default ({ app, Vue, router }) => {
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
