<template>
  <div class="home">
    <splitpanes class="default-theme overflow-hidden">
      <pane :key="0" size="20">
        <LayerPane />
      </pane>
      <pane :key="1" v-loading="generating" size="60">
        <div class="relative">
          <network
            :nodeList="nodes"
            :linkList="links"
            showLinkText
            nodeTextKey="label"
            nodeTypeKey="layer"
            linkTextKey="label"
            @clear=";(nodes = []), (links = [])"
            @deleteNode="deleteNode"
            @clickNode="clickNode"
            @deFocus="deFocus"
          />

          <InputPane />
        </div>
      </pane>
      <pane :key="2" size="20">
        <div class="w-full h-full bg-gray-800 text-gray-400 p-5">
          <DataPane />
        </div>
      </pane>
    </splitpanes>
  </div>
</template>

<script>
import LayerPane from '@/components/LayerPane.vue'
import InputPane from '@/components/InputPane.vue'
import DataPane from '@/components/DataPane.vue'
import Network from '@/components/Network'
import NetNode from '@/factory/node'
import NetLink from '@/factory/link'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { filter, map } from 'lodash'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  components: { LayerPane, Network, Splitpanes, Pane, InputPane, DataPane },
  computed: {
    ...mapState('network', ['nodes', 'links']),
    ...mapState('layer', ['generating']),
  },

  methods: {
    deleteNode (target) {
      let newNodes = filter(this.nodes, node => node.id !== target.id)
      newNodes = map(newNodes, node => new NetNode({
        id: node.id,
        label: node.label,
        closeness: 0,
        layer: node.layer,
      }))

      let newLinks = filter(this.links, link => link.source.id !== target.id && link.target.id !== target.id)
      newLinks = map(newLinks, link => new NetLink({
        source: link.source.id,
        target: link.target.id,
        label: '',
      }))
      this.$store.commit('network/SET_NODES', newNodes)
      this.$store.commit('network/SET_LINKS', newLinks)
    },

    clickNode (e, node) {
      this.$store.commit('network/SET_SELECTED_NODES', node)
    },
    deFocus () {
      this.$store.commit('network/SET_SELECTED_NODES', null)
    },
  },
}
</script>

<style scoped lang="postcss">
.home {
  @apply flex w-full h-full;
}
</style>
