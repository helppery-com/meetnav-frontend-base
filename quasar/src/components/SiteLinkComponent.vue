<template>
  <div>
    <span v-if="credits" style="color: #17416c">Credits:</span>
      <a v-bind:class="{'q-ml-md':addPadding}"
        style="color: #80a8b8;text-decoration: none" v-bind:href="href"
        target="blank"
      >
        {{link}}
      </a>
  </div>
</template>

<script>
export default {
  name: 'SiteLinkComponent',
  props: ['href', 'link', 'credits', 'addPadding']
}
</script>
