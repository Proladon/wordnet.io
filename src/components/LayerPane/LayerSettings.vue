<template>
  <section class="layer-settings">
    <vs-select v-model="generate" class="test" label="Generate">
      <vs-select-item
        v-for="(item, index) in options"
        :key="index"
        :value="item.text"
        :text="item.text"
      />
    </vs-select>
    <vs-select v-model="source" class="test" label="Source">
      <vs-select-item
        v-for="(item, index) in netData"
        :key="index"
        :value="item.text"
        :text="item.text"
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
    source: updateSetting('source'),
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
