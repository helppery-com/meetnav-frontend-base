import gtm from 'src/gtm'
import consentMng from 'src/consent'
import { initLogging, logging } from 'src/logging'

export default async ({ app, router, Vue, store }) => {
  initLogging(app, router, Vue, store)
  router.afterEach((to, from) => {
    gtm.logPage(to.path)
  })

  router.beforeEach(async (to, from, next) => {
    consentMng.onConsent(consent => {
      if (consent && consent.analytics) {
        gtm.init()
      }
    })
    try {
      logging.info('route event', {
        event: 'navigate',
        component: 'router',
        from: from.fullPath,
        to: to.fullPath
      })
    } catch {}
    const consent = await consentMng.getConsent()
    if (consent || to.path === '/consent') {
      next()
    } else {
      const { path, query } = to
      next({
        query: {
          back: { path, query }
        },
        path: '/consent'
      })
    }
  })
  Vue.mixin({
    computed: {
      $user () {
        return this.$storex.user.user
      },
      $isGuest () {
        return this.$user && this.$user.isGuest
      }
    }
  })
  const { $storex } = window
  $storex.user.init()
  $storex.room.loadUserRooms()
  if ($storex.user.user) {
    $storex.live.connect()
  }
}
