<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-black" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <span></span>
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/page1" label="Page One" />
        <q-route-tab to="/page2" label="Page Two" />
        <q-route-tab to="/page3" label="Page Three" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    <Footer></Footer>
  </q-layout>
</template>
<script>
import Footer from 'components/Footer'
export default {
  name: 'SearchLayout',
  data () {
    return {
    }
  },
  components: {
    Footer
  }
}
</script>
