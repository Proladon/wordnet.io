<template>
  <div class="layer-pane">
    <vs-tabs>
      <vs-tab label="Layers">
        <section class="layers-wrapper">
          <div v-for="layer in totalLayer" :key="layer" class="layers-list">
            <vs-button
              class="w-full text-gray-600 font-bold "
              color="#6EE7B7"
              type="filled"
              :class="{ 'de-avtivated': activatedLayer !== layer }"
              @click="selectLayer(layer)"
            >
              Layer {{ layer }}
            </vs-button>
            <vs-button
              v-if="layer > 1"
              class="text-gray-700 text-shadow-lg"
              color="danger"
              type="filled"
              icon="delete"
              @click="openDeleteLayerModal(layer)"
            />
            <vs-button
              v-if="layer === 1 && nodes.length"
              class="text-gray-700 text-shadow-lg"
              color="danger"
              type="filled"
              icon="cached"
              @click="showResetWarningModal = true"
            />
          </div>

          <vs-button
            v-loading="generating"
            :disabled="disabledAddLayerBtn"
            class="w-full my-[20px] text-gray-700 font-bold"
            color="primary"
            type="gradient"
            @click="addLayer"
          >
            + Layer {{ totalLayer + 1 }}
          </vs-button>
        </section>
      </vs-tab>

      <vs-tab label="Settings">
        <LayerSettings class=" pt-[20px]" />
      </vs-tab>

      <vs-tab label="Import/Export">
        <section class="grid gap-[10px] pt-[20px]">
          <vs-button class="w-full" color="primary" @click="importNodes">Import Nodes</vs-button>
          <input
            id="import"
            ref="nodeImport"
            class="hidden"
            type="file"
            name=""
            @input="importCSV"
          >

          <vs-button v-if="!nodes.length" class="w-full" disabled>
            Export
          </vs-button>
          <download-csv v-if="nodes.length" :data="nodes">
            <vs-button id="export-btn" class="w-full">Export</vs-button>
          </download-csv>
        </section>
      </vs-tab>
    </vs-tabs>

    <ImportWarningModalVue
      v-if="showImportWarningModal"
      @close="showImportWarningModal = false"
      @confirm="$refs['nodeImport'].click()"
    />

    <ResetWarningModalVue
      v-if="showResetWarningModal"
      @close="showResetWarningModal = false"
      @confirm="resetLayer"
    />

    <DeleteLayerWarningModal
      v-if="showDeleteLayerWarningModal"
      :layer="selectDelete"
      @close="showDeleteLayerWarningModal = false"
      @confirm="deleteLayer"
    />
  </div>
</template>

<script>
import csvMixin from '@/mixin/csv.vue'
import NetNode from '@/factory/node'
import NetLink from '@/factory/link'
import { mapState } from 'vuex'
import { filter, clone, map, shuffle } from 'lodash'
import LayerSettings from '@/components/LayerPane/LayerSettings.vue'
import ImportWarningModalVue from '@/components/LayerPane/ImportWarningModal.vue'
import ResetWarningModalVue from '@/components/LayerPane/ResetWarningModal.vue'
import DeleteLayerWarningModal from '@/components/LayerPane/DeleteLayerWarningModal.vue'
import { formatLabel } from '@/utils/helper'
import { api } from '@/utils/axios'

export default {
  name: 'LayerPane',
  components: { ImportWarningModalVue, ResetWarningModalVue, DeleteLayerWarningModal, LayerSettings },
  mixins: [csvMixin],
  data: () => ({
    showResetWarningModal: false,
    showDeleteLayerWarningModal: false,
    selectDelete: null,
  }),
  computed: {
    ...mapState('network', ['nodes', 'links']),
    ...mapState('layer', ['totalLayer', 'activatedLayer', 'generating', 'layerSettings']),
    disabledAddLayerBtn () {
      return this.generating || (!this.nodes.length && this.activatedLayer !== 0)
    },
    preLayer () {
      if (this.activatedLayer === 0) return 0
      return this.activatedLayer - 1
    },
    nextLayer () {
      return this.activatedLayer + 1
    },
  },

  methods: {
    async addLayer () {
      if (!this.isAPILayer()) return

      this.$store.commit('layer/SET_GENERATING', true)
      if (!this.nodes.length) return this.$store.commit('layer/SET_GENERATING', false)

      const curNodes = clone(this.nodes)

      for (const node of curNodes) {
        if (node.layer !== this.activatedLayer) continue

        let relations = await this.searchRelates(node)

        if (this.layerSettings.generate === 'random') relations = shuffle(relations)
        if (this.layerSettings.generate === 'relate') {
          relations.sort((a, b) => {
            if (a.weight > b.weight) return -1
            if (a.weight < b.weight) return 1
          })
        }

        if (!relations.length) continue
        const times = relations.length >= this.layerSettings.maxRelates ? this.layerSettings.maxRelates : relations.length
        let count = 1
        const list = []
        for (const relate of relations) {
          if (count > times) break
          const start = formatLabel(relate.start.label)
          const end = formatLabel(relate.end.label)
          const label = formatLabel(node.label) === start ? end : start

          if (!list.includes(label)) {
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

    resetLayer () {
      this.$store.commit('network/SET_NODES', [])
      this.$store.commit('network/SET_LINKS', [])
      this.$store.commit('layer/SET_TOTAL_LAYER', 1)
      this.$store.commit('layer/SET_ACTIVATED_LAYER', 1)
      this.$store.commit('layer/SET_GENERATING', false)
    },

    // => 刪除Layer
    openDeleteLayerModal (layer) {
      this.showDeleteLayerWarningModal = true
      this.selectDelete = layer
    },
    deleteLayer (layer) {
      if (!layer) return
      this.$store.commit('layer/SET_GENERATING', true)
      const curNodes = clone(this.nodes)
      const curLinks = clone(this.links)

      const layerNodes = filter(
        curNodes,
        (node) => node.layer !== layer && node.layer < layer,
      )

      const newNodes = map(layerNodes, node => {
        return new NetNode({
          id: node.id,
          label: formatLabel(node.label),
          closeness: 0,
          layer: node.layer,
        })
      })

      // 刪除當前層與大於層的連線
      const layerLinks = filter(curLinks, (link) => {
        return (
          link.source.layer !== layer &&
          link.target.layer !== layer &&
          link.target.layer < layer &&
          link.source.layer < layer
        )
      })

      const newLinks = map(layerLinks, link => {
        return new NetLink({
          source: link.source.id,
          target: link.target.id,
          label: '',
        })
      })

      this.$store.commit('network/SET_NODES', newNodes)
      this.$store.commit('network/SET_LINKS', newLinks)

      this.$store.commit('layer/SET_TOTAL_LAYER', layer - 1)
      this.$store.commit('layer/SET_ACTIVATED_LAYER', layer - 1)
      return this.$store.commit('layer/SET_GENERATING', false)
    },

    selectLayer (layer) {
      this.$store.commit('layer/SET_ACTIVATED_LAYER', layer)
    },

    newNode (label) {
      const node = new NetNode({
        id: `${this.activatedLayer + 1}-${label}`,
        label,
        closeness: 0,
        layer: this.activatedLayer + 1,
      })
      return node
    },

    newLink (node, label) {
      const link = new NetLink({
        source: `${this.activatedLayer + 1}-${label}`,
        target: node.id,
        label: '',
      })
      return link
    },

    async searchRelates (node) {
      const [res] = await api({
        method: 'get',
        url: `/en/${node.label}`,
      })
      return filter(res.edges, i => i.start.language === 'en' && i.end.language === 'en')
    },

    isAPILayer () {
      /* 生成的層數是否為需要打請求的層 */
      if (this.activatedLayer % 2 === 0 || this.activatedLayer === 0) {
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
::v-deep .con-vs-tabs .con-slot-tabs{
  /* @apply overflow-y-auto */
  @apply h-full px-[20px] ;
}
.layer-pane {
  @apply flex flex-col justify-between gap-2  bg-[#2B303B] text-gray-400;
  @apply py-5 h-full w-full min-w-[300px]  ;
}

.layers-wrapper {
  @apply overflow-y-auto flex-1 flex flex-col gap-3 pt-[20px];
}

.layers-list {
  @apply flex items-center justify-between gap-5;
}

.de-avtivated {
  @apply !bg-gray-600 text-gray-400 font-normal;
}

</style>
