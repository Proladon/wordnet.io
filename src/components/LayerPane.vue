<template>
  <div class="layer-pane">
    <section>
      <div
        class="layer-btn"
        :class="{ avtivated: activatedLayer === layer }"
        v-for="layer in totalLayer"
        :key="layer"
        @click="selectLayer(layer)"
      >
        Layer {{ layer }}
      </div>
      <div class="add-layer-btn" @click="addLayer">
        + Layer {{ totalLayer + 1 }}
      </div>
    </section>

    <section>
      <download-csv :data="nodes">
        <div id="export-btn">Export</div>
      </download-csv>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'LayerPane',
  computed: {
    ...mapState('network', ['nodes']),
    ...mapState('layer', ['totalLayer', 'activatedLayer']),
    preLayer() {
      if (this.activatedLayer === 0) return 0
      return this.activatedLayer - 1
    },
    nextLayer() {
      return this.activatedLayer + 1
    },
  },

  methods: {
    addLayer() {
      this.$store.commit('layer/SET_TOTAL_LAYER', this.totalLayer + 1)
      this.$store.commit('layer/SET_ACTIVATED_LAYER', this.totalLayer)
    },

    selectLayer(layer) {
      this.$store.commit('layer/SET_ACTIVATED_LAYER', layer)
    },
  },
}
</script>

<style scoped lang="postcss">
.layer-pane {
  @apply flex flex-col justify-between gap-2  bg-gray-800 text-white;
  @apply p-5 h-full w-full w-[200px];
}

.layer-btn,
.add-layer-btn {
  @apply cursor-pointer rounded-md;
  @apply my-[5px] py-[2px];
}

.avtivated {
  @apply bg-teal-400 text-gray-800 font-bold;
}

.add-layer-btn {
  @apply border-dashed border-1;
}

#export-btn {
  @apply bg-orange-400 text-gray-800 font-bold rounded-md cursor-pointer;
}
</style>
