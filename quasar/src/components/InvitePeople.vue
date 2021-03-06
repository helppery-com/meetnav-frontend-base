<template>
<div class="full-height full-width flex column items-center justify-center">
  <p class="text-h1 text-weight-bold">{{$t('coBrowsePage.invite')}}</p>
  <div class=" column wrapper">
  <p class="text-h4 text-weight-bolder">{{$t('coBrowsePage.instructions')}}</p>
  <p class="text-h6 text-weight-bolder">https://www.meetnav.com/xxx-yyy-zzz</p>
  <div class="flex w-full justify-around">
    <q-btn round color="primary" icon="facebook" />
    <q-btn round color="primary" icon="shopping_cart" />
    <q-btn round color="primary" icon="shopping_cart" />
    <q-btn round color="primary" icon="shopping_cart" />
    <q-btn round color="primary" icon="shopping_cart" />
    <q-btn round color="primary" icon="shopping_cart" />
    <q-btn round color="primary" icon="mail_outline" />
  </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'InvitePeople'
}
</script>

<style scoped lang="sass">
.wrapper
  max-width: 600px
  word-wrap: break-word
  text-align: center
  height: fit-content
@media screen and (max-width: 870px)
  .text-h1
    font-size: 60px
  .text-h4
    font-size: 30px
@media screen and (max-width: 550px)
  .text-h1
    font-size: 30px
  .text-h4
    font-size: 20px
  .text-h6
    font-size: 15px
</style>
