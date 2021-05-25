import gtm from 'src/gtm'
import { initLogging, logging } from 'src/logging'

export default async ({ app, router, Vue, store }) => {
  initLogging(app, router, Vue, store)
  router.afterEach((to, from) => {
    gtm.logPage(to.path)
  })
  router.beforeEach((to, from, next) => {
    try {
      logging.info('route event', {
        event: 'navigate',
        component: 'router',
        from: from.fullPath,
        to: to.fullPath
      })
    } catch {}
    next()
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
}
