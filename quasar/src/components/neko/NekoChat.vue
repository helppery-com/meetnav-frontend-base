<template>
  <neko-chat class="neko-chat fit"/>
</template>
<script>
import { NekoChat } from 'neko-client/dist/neko-lib.umd'

import 'neko-client/dist/neko-lib.css'
import '../../assets/styles/vendor/_font-awesome.scss'
import '../../assets/styles/vendor/_emoji.scss'

export default {
  components: {
    NekoChat
  }
}
</script>
<style lang="sass">
  .neko-chat
    color: #dcddde
    ol, ul
      list-style: none
      padding-inline-start: 0
      margin-block-start: 0
      margin-block-end: 0
      margin-inline-start: 0
      margin-inline-end: 0
    div
      margin: 0
    span
      &.emoji
        margin: 0
        padding: 0
        border: 0
        font: inherit
        font-size: 100%
    li.event
      display: none !important
    .content
      .content-body
        color: $dark !important
    .text-container
      background-color: #9e9e9e !important
      color: white !important
      textarea
        color: white
        &:focus
          outline: none
</style>
