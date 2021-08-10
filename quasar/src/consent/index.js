import { Cookies } from 'quasar'

const coookieName = 'meetnav_consent'
const listeners = []

export default {
  async getConsent () {
    return await Cookies.get(coookieName)
  },
  setConsent (consent) {
    Cookies.set(coookieName, consent)
    listeners.forEach(cb => cb(consent))
  },
  onConsent (cb) {
    listeners.push(cb)
  }
}
