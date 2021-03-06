<template>
<div class="full-height full-width flex column items-center justify-center">
  <p class="text-h1 text-weight-bold">{{$t('coBrowsePage.invite')}}</p>
  <div class=" column " style="max-width: 60%; text-align: center;">
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

<style scoped>

</style>
