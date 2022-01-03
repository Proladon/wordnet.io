<template>
  <section class="layer-settings">
    <vs-select label="filter" v-model="order">
      <vs-select-item  :key="item" :value="item.value" :text="item" v-for="item in options"  />
    </vs-select>
  </section>
</template>

<script>
export default {
  name: 'LayerSettings',
  data: () => ({
    order: '',
    options: ['最相關', '隨機']
  })
}
</script>

<style>

</style>