// import something here

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
import VueI18n from 'vue-i18n'
import { translations } from '../translations/translation'
import Vue from 'vue'

Vue.use(VueI18n)
const i18n = new VueI18n(
  {
    locale: 'en',
    fallbackLocale: 'en',
    messages: translations
  }
)
export default ({ app, Vue }) => {
  i18n.locale = Vue.prototype.$storex.user.lang
  app.i18n = i18n
}

export { i18n }
