<template>
  <section class="layer-settings">
    <vs-select class="test" label="filter" v-model="order">
      <vs-select-item  :key="item" :value="item.value" :text="item" v-for="item in options"  />
    </vs-select>
    <vs-select class="test" label="filter" v-model="net">
      <vs-select-item  :key="item" :value="item.value" :text="item" v-for="item in netData"  />
    </vs-select>
  </section>
</template>

<script>
export default {
  name: 'LayerSettings',
  data: () => ({
    order: '',
    net: '',
    options: ['最相關', '隨機'],
    netData: ['conceptNet', 'wtf'],
  })
}
</script>

<style scoped lang="postcss">
::v-deep .input-select {
    @apply !text-gray-700 font-medium;
  }
.test {
  @apply text-left w-full;
  
}
::v-deep .vs-select--label {
  @apply text-white text-left;
}
</style>