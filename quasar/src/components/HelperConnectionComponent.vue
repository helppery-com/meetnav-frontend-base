<template>
  <q-card >
    <q-card-section>
      <!--  user searched term    -->
      <span class="text-h6 main-heading" style="overflow-wrap: break-word;">{{$t('searchPage.peopleConnect')+' : '}}<em>{{this.query}}</em></span>
    </q-card-section>
    <q-separator />
    <q-card-section class="my-section">
      <!--  spinner in case when the data is being fetched from server    -->
      <spinner-component v-if="!loadedData"></spinner-component>
      <!--   helper connections list   -->
     <result-people-connect-item
       v-for="help in this.getHelpers"
       v-bind:key="help.id"
       v-bind:username="help.username"
       v-bind:avatar="help.avatar"
       v-bind:rating="help.rating">
     </result-people-connect-item>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapGetters } from 'vuex'
import ResultPeopleConnectItem from 'components/ResultPeopleConnectItem'
import SpinnerComponent from 'components/SpinnerComponent'
export default {
  name: 'HelperConnectionComponent',
  props: ['helpers'],
  components: {
    ResultPeopleConnectItem,
    SpinnerComponent
  },
  computed: {
    ...mapGetters({
      query: 'search/getQuery',
      loadedData: 'search/getLoadState'
    }),
    getHelpers () {
      return this.helpers
    }
  }
}
</script>

<style scoped>
.main-heading {
  color: #3d7094;
  font-weight: 900;
}
@media screen and (max-width: 450px){
  .my-section{
    padding: 10px 0px 10px 0px !important;
  }
}
</style>
