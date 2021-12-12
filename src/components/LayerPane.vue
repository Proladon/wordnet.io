<template>
  <div class="layer-pane">
    <section>
      <div
        class="flex items-center justify-between gap-5"
        v-for="layer in totalLayer"
        :key="layer"
      >
        <div
          class="primary-btn layer-btn"
          :class="{ 'de-avtivated': activatedLayer !== layer }"
          @click="selectLayer(layer)"
        >
          Layer {{ layer }}
        </div>
        <i
          class="el-icon-delete-solid delete-layer-btn"
          @click="deleteLayer(layer)"
        />
      </div>

      <div class="primary-btn add-layer-btn" @click="addLayer">
        + Layer {{ totalLayer + 1 }}
      </div>
    </section>

    <section>
      <div class="primary-btn func-btn" @click="importNodes">Import Nodes</div>
      <input
        class="hidden"
        @input="importCSV"
        ref="nodeImport"
        type="file"
        name=""
        id="import"
      />

      <div class="primary-btn func-btn disabled" v-if="!nodes.length">
        Export
      </div>
      <download-csv :data="nodes" v-if="nodes.length">
        <div class="primary-btn func-btn" id="export-btn">Export</div>
      </download-csv>
    </section>

    <ImportWarningModalVue
      v-if="showImportWarningModal"
      @close="showImportWarningModal = false"
      @confirm="$refs['nodeImport'].click()"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import csv2json from 'csvjson-csv2json'
import { forEach } from 'lodash'
import NetNode from '@/factory/node'
// import NetLink from '@/factory/link'
import ImportWarningModalVue from '@/components/LayerPane/ImportWarningModal.vue'

export default {
  name: 'LayerPane',
  components: { ImportWarningModalVue },
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
  data: () => ({
    showImportWarningModal: false,
  }),

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
          Number(this.closeness) || 0,
          1
        )
        list.push(node)
      })

      this.$store.commit('network/SET_NODES', list)
      this.$message.success('Import nodes success')
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

    deleteLayer(layer) {
      console.log(layer)
    },

    importNodes() {
      this.showImportWarningModal = true
      // this.$refs['nodeImport'].click()
    },
  },
}
</script>

<style scoped lang="postcss">
.layer-pane {
  @apply flex flex-col justify-between gap-2  bg-[#2B303B] text-gray-400;
  @apply p-5 h-full w-full;
}
.layer-btn {
  @apply w-full text-gray-700;
}

.layer-btn:is(.de-avtivated) {
  @apply hover:bg-opacity-70;
}
.de-avtivated {
  @apply bg-gray-400;
}

.add-layer-btn {
  @apply border-dashed border-1 bg-transparent hover:bg-emerald-300 hover:text-gray-700;
}

.func-btn {
  @apply text-gray-700 hover:bg-opacity-50;
}

.delete-layer-btn {
  @apply hover:text-rose-400 cursor-pointer;
  transition: 0.3s;
}

.disabled {
  @apply bg-gray-400 cursor-not-allowed hover:bg-opacity-100;
}
</style>
