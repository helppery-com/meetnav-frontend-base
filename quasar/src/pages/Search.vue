<template>
<q-page class="full-width row q-mt-xs">
  <div class="col-1 xs-hide "></div>
  <div class="col-xs-12 col-sm-11 col-md-11 col-lg-11 col-xl-11 flex row" style="flex-shrink: 1;flex-grow: 0">
  <div class="full-height ellipsis parent-results" v-if="getLoadState" style="flex-basis: 920px">
    <div class="bg-yellow search-result">
      <!--  helper component will be displayed in smaller screen size    -->
      <helper-connection-component v-bind:helpers="searchHelpers"></helper-connection-component>
    </div>
    <search-result-item-component
      v-for="item in searchResults"
      v-bind:key="item.cacheId"
      v-bind:title="item.title"
      v-bind:display-link="item.displayLink"
      v-bind:snippet="item.htmlSnippet"
      v-bind:link="item.link">
    </search-result-item-component>
  </div>
      <!--  spinner area  -->
    <div class="full-height flex justify-center items-center ellipsis parent-results" v-if="!getLoadState" style="flex-basis: 920px">
      <spinner-component spinner-size="3 rem"></spinner-component>
    </div>
  <div class="full-height search-result-people">
    <helper-connection-component v-bind:helpers="searchHelpers"></helper-connection-component>
  </div>
  </div>
</q-page>
</template>

<script>
import SearchResultItemComponent from 'components/SearchResultItemComponent'
import HelperConnectionComponent from 'components/HelperConnectionComponent'
import SpinnerComponent from 'components/SpinnerComponent'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'Search',
  components: {
    SearchResultItemComponent,
    HelperConnectionComponent,
    SpinnerComponent
  },
  created () {
    this.getResult()
  },
  computed: {
    ...mapGetters({
      searchResults: 'search/getSearchItems',
      searchHelpers: 'search/getHelpers',
      getLoadState: 'search/getLoadState'
    })
  },
  methods: {
    ...mapActions({
      getResult: 'search/search'
    })
  }
}
</script>

<style scoped>
.search-result-people{
  flex-basis: 500px;
  flex-shrink: 1;
}
.search-result {
  flex-basis: 500px;
  flex-shrink: 0;
}
.search-result{
  display: none;
}
.parent-results {
  flex-basis: 1000px;
}
@media screen and (max-width:1643px){
  .search-result-people{
    display: none;
  }
  .search-result{
    display: block;
  }
}
</style>
