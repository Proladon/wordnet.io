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
      <label for="import">Import</label>
      <input
        class="hidden"
        @input="importCSV"
        type="file"
        name=""
        id="import"
      />
      <download-csv :data="nodes">
        <div id="export-btn">Export</div>
      </download-csv>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import csv2json from 'csvjson-csv2json'
import { forEach } from 'lodash'
import NetNode from '@/factory/node'
// import NetLink from '@/factory/link'

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

    parseCSVData(data) {
      console.log(data)
      const list = []
      forEach(data, (item) => {
        const node = new NetNode(
          `1-${item.Label}`,
          item.Label,
          Number(this.closeness),
          1
        )
        list.push(node)
      })

      this.$store.commit('network/SET_NODES', list)
    },

    importCSV(e) {
      let file = e.target.files[0]
      let reader = new FileReader()
      reader.onload = () => {
        const csvArray = csv2json(reader.result, { parseNumbers: true })
        this.parseCSVData(csvArray)
      }
      reader.readAsText(file)
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
