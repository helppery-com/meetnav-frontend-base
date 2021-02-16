<template>
<div class="search-input q-ml-lg ">
  <q-input v-bind:label="$t('searchPlaceholder')" v-model = "query" outlined rounded standout="text-black" dense>
    <template v-slot:append>
      <q-icon name="cancel" />
    </template>
  </q-input>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SearchInputComponent',
  data () {
    return {
      query: null
    }
  },
  mounted () {
    this.query = this.userQuery
  },
  computed: {
    ...mapGetters({
      userQuery: 'search/getQuery'
    })

  }
}
</script>

<style lang="sass">
  .search-input
    height: 100%
</style>
