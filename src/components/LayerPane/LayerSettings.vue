<template>
  <section class="layer-settings">
    <div class="grid gap-[10px]">
      <p class="font-medium">Generate Layer</p>
      <vs-select v-model="generate" class="test" label="Filter">
        <vs-select-item
          v-for="(item, index) in options"
          :key="index"
          :value="item.value"
          :text="item.text"
        />
      </vs-select>
      <vs-input v-model="maxRelates" label="Max relates" class="test" />

      <vs-select v-model="source" class="test" label="Source">
        <vs-select-item
          v-for="(item, index) in netData"
          :key="index"
          :value="item.text"
          :text="item.text"
        />
      </vs-select>
    </div>
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
      { text: 'Most relevant', value: 'relate' },
      { text: 'Random', value: 'random' },
    ],
    netData: [{ text: 'conceptNet' }],
  }),
  computed: {
    ...mapState('layer', ['layerSettings']),
    generate: updateSetting('generate'),
    source: updateSetting('source'),
    maxRelates: updateSetting('maxRelates'),
  },
}
</script>

<style lang="postcss">
label {
  @apply !text-gray-400;
}
</style>

<style scoped lang="postcss">

.layer-settings{
  @apply overflow-y-auto pb-[30px] overflow-x-hidden;
}
::v-deep .input-select {
  @apply !text-gray-700 font-medium;
}
.test {
  @apply text-left w-full;
}

</style>
