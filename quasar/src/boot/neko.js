export default async ({ Vue }) => {
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
