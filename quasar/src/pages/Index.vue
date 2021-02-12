<template>
  <q-page :style-fn="myTweaks" class="flex items-center column justify-start" style="flex-wrap: nowrap">
    <div class="q-px-md top-end">
      <div class="full-width">
        <h3 class="text-h3 main-heading">meetnav</h3>
      </div>
      <div class="full-width">
        <h5 class="text-h5 main-heading">{{ $t('welcomePage.message') }}</h5>
      </div>
      <!--   input with pills    -->
      <div class="give-outer-space flex items-center justify-center">
        <div class="full-width">
          <input type="text" v-on:keypress.enter="initSearch" v-bind:placeholder="$t('welcomePage.searchPlaceholder')" class="search-input q-pl-md">
          <div class="full-width flex q-pt-sm">
            <q-btn color="grey-4" no-caps  text-color="#5a5a5a" size="10px" rounded="rounded" unelevated class="q-ma-xs" icon="local_fire_department" v-bind:label="$t('welcomePage.tags.a')" />
            <q-btn color="grey-4" no-caps text-color="#5a5a5a" size="10px" rounded="rounded" unelevated icon="fas fa-headset" class="q-ma-xs" v-bind:label="$t('welcomePage.tags.b')" />
            <q-btn color="grey-4" no-caps text-color="#5a5a5a" size="10px" rounded="rounded" unelevated icon="movie" class="q-ma-xs" v-bind:label="$t('welcomePage.tags.c')" />
            <q-btn color="grey-4" no-caps text-color="#5a5a5a" size="10px" rounded="rounded" unelevated icon="shopping_cart" class="q-ma-xs" v-bind:label="$t('welcomePage.tags.d')" />
            <q-btn color="grey-4" no-caps text-color="#5a5a5a" size="10px" rounded="rounded" unelevated icon="airplanemode_active" class="q-ma-xs" v-bind:label="$t('welcomePage.tags.e')" />
          </div>
        </div>
      </div>
      <!--    Search Internet    -->
      <div class="give-outer-space flex items-center justify-center">
        <div class="full-width flex items-center justify-center internet-buttons">
          <q-btn color="black" no-caps outline class="q-mr-xs search-width" icon="search" v-bind:label="$t('welcomePage.searchInternet')" />
          <q-btn color="purple-7" no-caps class="q-ml-xs search-width" icon="video_call" v-bind:label="$t('welcomePage.searchTogether')" />
        </div>
      </div>

    </div>
    <!--   End Caption     -->
      <div class="end-caption flex items-center justify-center q-px-md">
        <div class="">
          <q-img
            :src="url"
            spinner-color="purple-7"
            img-class="img-circles"
            style=" width: 50px; height: 50px;border-radius: 50% 50%; border-width: 2px; border-style: solid; border-color: white; transform: translateX(0px)"
          />
          <q-img
            :src="url"
            spinner-color="purple-7"
            img-class="img-circles"
            style=" width: 50px; height: 50px;border-radius: 50% 50%; border-width: 2px; border-style: solid; border-color: white; transform: translateX(-10px)"
          />
          <q-img
            :src="url"
            spinner-color="purple-7"
            img-class="img-circles"
            style=" width: 50px; height: 50px;border-radius: 50% 50%; border-width: 2px; border-style: solid; border-color: white; transform: translateX(-20px)"
          />
        </div>
        <span class=" text-h6 main-heading" style="font-weight: 600">{{ $t('welcomePage.endCaption') }}</span>
      </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      rounded: true,
      url: 'https://placeimg.com/500/300/nature'
    }
  },
  methods: {
    myTweaks (offset, height) {
      return { height: '791px' }
    },
    initSearch () {
      this.$router.push('/search')
    }
  }
}
</script>
<style scoped lang="css">
.search-input{
  width: 100%;
  height: 50px;
  border-color: darkgray;
  border-width: 1px;
  border-style: solid;
  outline: none;
  font-size: 20px;
  border-radius: 25px;
}
.main-heading{
  color: #6b7e8d;
  font-weight: 900;
  text-align: center;
}
.search-width{
  width: 49%;
}
.give-outer-space{
  height: 160px;
}
.top-end{
  height: 75%;
}

@media screen and (max-width: 500px){
  .internet-buttons {
    flex-direction: column !important;
    align-items: center !important;
    justify-content: flex-end !important;
  }
  .search-width{
    width: 90%;
  }
  .internet-buttons > button{
    margin-right: 0px;
    margin-left: 0px;
    margin: 10px;
  }
}
</style>
