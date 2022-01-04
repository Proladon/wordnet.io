<template>
  <div class="layer-pane">
    <vs-tabs>
      <vs-tab label="Layers">
        <section class="overflow-y-auto flex-1 flex flex-col gap-3 pt-[20px]">
          <div class="flex items-center justify-between gap-5" v-for="layer in totalLayer" :key="layer">
            <vs-button class="w-full" color="#6EE7B7" type="filled"
              :class="{ 'de-avtivated': activatedLayer !== layer }" @click="selectLayer(layer)">
              Layer {{ layer }}
            </vs-button>
            <vs-button @click="deleteLayer(layer)" color="danger" type="filled" icon="delete" />
          </div>

          <vs-button class="w-full my-[20px] " color="primary" type="filled" @click="addLayer">
            + Layer {{ totalLayer + 1 }}
          </vs-button>
        </section>
        
      </vs-tab>

      <vs-tab label="Settings">
        <LayerSettings  class=" pt-[20px]" />
      </vs-tab>

      <vs-tab label="Import/Export">
        <section class="grid gap-[10px] pt-[20px]">
          <vs-button class="w-full" color="primary" @click="importNodes">Import Nodes</vs-button>
          <input class="hidden" @input="importCSV" ref="nodeImport" type="file" name="" id="import" />

          <vs-button class="w-full" disabled v-if="!nodes.length">
            Export
          </vs-button>
          <download-csv :data="nodes" v-if="nodes.length">
            <vs-button class="primary-btn func-btn" id="export-btn">Export</vs-button>
          </download-csv>
        </section>
      </vs-tab>
    </vs-tabs>

    <ImportWarningModalVue v-if="showImportWarningModal" @close="showImportWarningModal = false"
      @confirm="$refs['nodeImport'].click()" />
  </div>
</template>

<script>
import NetNode from '@/factory/node'
import NetLink from '@/factory/link'
import { mapState } from 'vuex'
import csv2json from 'csvjson-csv2json'
import { forEach, filter, clone } from 'lodash'
import LayerSettings from '@/components/LayerPane/LayerSettings.vue'
import ImportWarningModalVue from '@/components/LayerPane/ImportWarningModal.vue'
import {api} from '@/utils/axios'

export default {
  name: 'LayerPane',
  components: { ImportWarningModalVue, LayerSettings },
  computed: {
    ...mapState('network', ['nodes', 'links']),
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
    async addLayer() {
      this.$store.commit('layer/SET_TOTAL_LAYER', this.totalLayer + 1)
      this.$store.commit('layer/SET_ACTIVATED_LAYER', this.totalLayer)
      await this.searchRelates()
    },

    async searchRelates() {
      if(!this.nodes.length) return
      
      for(const node of clone(this.nodes)) {
        const [res] = await api({
          method: 'get',
          url: `/en/${node.label}`
        })
        const relations = res.edges
        console.log(relations)

        relations.forEach(relate => {
          const start = relate.start.label
          const end = relate.end.label
          const label = node.label === start ? end : start

          this.addNode(label)
          this.addLink(node, label)
        })
      }
    },

    addNode(label) {
      const node = new NetNode({
        id: `${this.nextLayer}-${label}`,
        label,
        closeness: 0,
        layer: this.nextLayer
      })
      this.$store.commit('network/ADD_NODES', node)
    },

    addLink(node, label) {
      const link = new NetLink({
        source: `${this.nextLayer}-${label}`,
        target: node.id,
        label: ''
      })
      this.$store.commit('network/ADD_LINKS', link)
    },

    selectLayer(layer) {
      this.$store.commit('layer/SET_ACTIVATED_LAYER', layer)
    },

    parseCSVData(data) {
      console.log(data)
      const list = []
      forEach(data, (item) => {
        const node = new NetNode({
          id: `1-${item.Label}`,
          label: item.Label,
          closeness: Number(this.closeness) || 0,
          layer: 1
        })
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
      const nodesRef = JSON.parse(JSON.stringify(this.nodes))
      const linksRef = JSON.parse(JSON.stringify(this.links))

      // 刪除當前層與大於層的節點
      const layerNodes = filter(
        nodesRef,
        (node) => node.layer !== layer && node.layer < layer
      )
      this.$store.commit('network/SET_NODES', layerNodes)

      // 刪除當前層與大於層的連線
      const layerLinks = filter(linksRef, (link) => {
        return (
          link.source.layer !== layer &&
          link.target.layer !== layer &&
          link.target.layer < layer &&
          link.source.layer < layer
        )
      })
      this.$store.commit('network/SET_LINKS', layerLinks)

      // 刪除當前層與大於的層

      this.$store.commit('layer/SET_TOTAL_LAYER', layer - 1)
      this.$store.commit('layer/SET_ACTIVATED_LAYER', layer - 1)

      // FIXME 刪除後 index 不會更新導致連線有問題
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
  @apply p-5 h-full w-full min-w-[300px];
}
.layer-btn {
  @apply w-full text-gray-700;
}

.layer-btn:is(.de-avtivated) {
  @apply hover:bg-opacity-70;
}
.de-avtivated {
  @apply !bg-gray-600;
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
