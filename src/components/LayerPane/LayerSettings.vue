<template>
  <section class="layer-settings">
    <vs-select class="test" label="Generate" v-model="generate">
      <vs-select-item
        :key="index"
        :value="item.text"
        :text="item.text"
        v-for="(item, index) in options"
      />
    </vs-select>
    <vs-select class="test" label="Source" v-model="source">
      <vs-select-item
        :key="index"
        :value="item.text"
        :text="item.text"
        v-for="(item, index) in netData"
      />
    </vs-select>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { updateSetting } from '@/utils/helper'

export default {
  name: 'LayerSettings',
  data: () => ({
    order: '',
    net: '',
    options: [
      { text: '最相關' },
      { text: '隨機' },
    ],
    netData: [{ text: 'conceptNet' }],
  }),
  computed: {
    ...mapState('layer', ['layerSettings']),
    generate: updateSetting('generate'),
    source: updateSetting('source')
  },
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