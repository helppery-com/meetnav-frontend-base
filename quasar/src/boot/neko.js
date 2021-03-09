import { VTooltip, VPopover } from 'v-tooltip'

export default async ({ Vue }) => {
  Vue.directive('tooltip', VTooltip)
  Vue.component('v-popover', VPopover)

  Vue.mixin({
    methods: {
      $notify ({ group, type, title, duration, speed }) {
        return this.$q.notify({
          type,
          message: title,
          timeout: duration
        })
      }
    }
  })
}
