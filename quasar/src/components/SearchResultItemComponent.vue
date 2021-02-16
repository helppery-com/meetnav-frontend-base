<template>
<div class="search-result q-ma-sm q-mb-lg" style="height: fit-content;">
  <!-- link -->
  <site-link-component class="adjust-link" v-bind:link="getDisplayLink" credis="false" v-bind:href="link"></site-link-component>
  <!-- main description -->
  <!-- main text -->
  <div class="flex row items-center " style="flex-wrap: nowrap">
    <q-btn outline color="primary" content-class="col-1" icon="video_call" />
    <p class="main-heading text-h5 q-ml-sm q-mt-md ellipsis">{{getTitle}}</p>
  </div>
  <!-- description text -->
    <div class="search-description text-subtitle1 ellipsis" v-html="getSnippet" ></div>

</div>
</template>

<script>
import SiteLinkComponent from 'components/SiteLinkComponent'
export default {
  name: 'SearchResultItemComponent',
  props: ['title', 'displayLink', 'snippet', 'link'],
  components: {
    SiteLinkComponent
  },
  computed: {
    getTitle () {
      return this.title
    },
    getDisplayLink () {
      return this.displayLink
    },
    getSnippet () {
      return this.snippet
    }
  }
}
</script>

<style lang="sass">
.search-result
  .adjust-link
    transform: translatey(13px)

  .main-heading
    color: #3d7094
    font-weight: 900

  .main-heading:hover
    cursor: pointer

  .search-description
    color: #3d7094
    font-weight: 400
</style>
