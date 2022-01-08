<template>
  <div class="layer-pane">
    <vs-tabs>
      <vs-tab label="Layers">
        <section class="layers-wrapper">
          <div class="layers-list" v-for="layer in totalLayer" :key="layer">
            <vs-button class="w-full" color="#6EE7B7" type="filled"
              :class="{ 'de-avtivated': activatedLayer !== layer }" @click="selectLayer(layer)">
              Layer {{ layer }}
            </vs-button>
            <vs-button v-if="layer > 1" @click="deleteLayer(layer)" color="danger" type="filled" icon="delete" />
            <vs-button v-if="layer === 1 && nodes.length" @click="deleteLayer(layer)" color="danger" type="filled" icon="cached" />
          </div>

          <vs-button v-loading="generating" :disabled="disabledAddLayerBtn"  class="w-full my-[20px] " color="primary" type="filled" @click="addLayer">
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
            <vs-button class="w-full" id="export-btn">Export</vs-button>
          </download-csv>
        </section>
      </vs-tab>
    </vs-tabs>

    <ImportWarningModalVue v-if="showImportWarningModal" @close="showImportWarningModal = false"
      @confirm="$refs['nodeImport'].click()" />
  </div>
</template>

<script>
import csvMixin from '@/mixin/csv.vue'
import NetNode from '@/factory/node'
import NetLink from '@/factory/link'
import { mapState } from 'vuex'
import {  filter, clone } from 'lodash'
import LayerSettings from '@/components/LayerPane/LayerSettings.vue'
import ImportWarningModalVue from '@/components/LayerPane/ImportWarningModal.vue'
import {api} from '@/utils/axios'

export default {
  name: 'LayerPane',
  mixins: [csvMixin],
  components: { ImportWarningModalVue, LayerSettings },
  computed: {
    ...mapState('network', ['nodes', 'links']),
    ...mapState('layer', ['totalLayer', 'activatedLayer', 'generating']),
    disabledAddLayerBtn() {
      return this.generating || (! this.nodes.length && this.activatedLayer !== 0)
    },
    preLayer() {
      if (this.activatedLayer === 0) return 0
      return this.activatedLayer - 1
    },
    nextLayer() {
      return this.activatedLayer + 1
    },
  },

  methods: {
    async addLayer() {
      if(! this.isAPILayer()) return

      this.$store.commit('layer/SET_GENERATING', true)
      if(!this.nodes.length) return this.$store.commit('layer/SET_GENERATING', false)

      const curNodes = clone(this.nodes)

      for(const node of curNodes) {
        if(node.layer !== this.activatedLayer) continue
        
        const relations = await this.searchRelates(node)

       
        // TODO 根據設定過濾: 權重? 數量?
        relations.sort((a, b) => {
          if( a.weight > b.weight) return -1
          if( a.weight < b.weight) return 1
        })

        if(! relations.length) continue
        const times = relations.length >= 5 ? 5 : relations.length
        let count = 1
        const list = []
        for(const relate of relations) {
          if(count > times) break
          const start = relate.start.label
          const end = relate.end.label
          const label = node.label === start ? end : start
          
          if(! list.includes(label)) {
            this.$store.commit('network/ADD_NODES', this.newNode(label))
            this.$store.commit('network/ADD_LINKS', this.newLink(node, label))
            count += 1
            list.push(label)
          }
        }
      }

      this.$store.commit('layer/SET_TOTAL_LAYER', this.totalLayer + 1)
      this.$store.commit('layer/SET_ACTIVATED_LAYER', this.totalLayer)
      this.$store.commit('layer/SET_GENERATING', false)
    },

    deleteLayer(layer) {
      if(layer === 1) {
        this.$store.commit('network/SET_NODES', [])
        this.$store.commit('network/SET_LINKS', [])
        return
      }
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
    
    selectLayer(layer) {
      this.$store.commit('layer/SET_ACTIVATED_LAYER', layer)
    },

    newNode(label) {
      const node = new NetNode({
        id: `${this.activatedLayer + 1}-${label}`,
        label,
        closeness: 0,
        layer: this.activatedLayer + 1
      })
      return node
    },

    newLink(node, label) {
      const link = new NetLink({
        source: `${this.activatedLayer + 1}-${label}`,
        target: node.id,
        label: ''
      })
      return link
    },

    async searchRelates(node) {
      const [res] = await api({
        method: 'get',
        url: `/en/${node.label}`
      })
      return res.edges
    },

    isAPILayer() {
      /* 生成的層數是否為需要打請求的層 */
      if(this.activatedLayer + 1 > 3 || this.activatedLayer === 0) {
        this.$store.commit('layer/SET_TOTAL_LAYER', this.totalLayer + 1)
        this.$store.commit('layer/SET_ACTIVATED_LAYER', this.totalLayer)
        return false
      }
      return true
    },




  },
}
</script>

<style scoped lang="postcss">
.layer-pane {
  @apply flex flex-col justify-between gap-2  bg-[#2B303B] text-gray-400;
  @apply p-5 h-full w-full min-w-[300px];
}

.layers-wrapper {
  @apply overflow-y-auto flex-1 flex flex-col gap-3 pt-[20px];
}

.layers-list {
  @apply flex items-center justify-between gap-5;
}

</style>
