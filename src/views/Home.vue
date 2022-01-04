<template>
  <div class="home">
    <splitpanes class="default-theme overflow-hidden">
      <pane :key="0" size="20">
        <LayerPane />
      </pane>
      <pane :key="1" size="60">
        <div class="relative ">
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
          <InputPane class="absolute bottom-0 left-0 right-0" />
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
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { filter, difference } from 'lodash'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  components: { LayerPane, Network, Splitpanes, Pane, InputPane, DataPane },
  computed: {
    ...mapState('network', ['nodes', 'links']),
  },

  methods: {
    deleteNode(node) {
      this.nodes.splice(node.index, 1)
      this.deleteRefLink(node)
    },

    deleteRefLink(node) {
      // FIXME 有bug
      const removes = filter(this.links, (link) => {
        return link.source.id === node.id || link.target.id === node.id
      })

      this.links = difference(this.links, removes)
    },

    clickNode(e, node) {
      // this.selectedNode = node
      this.$store.commit('network/SET_SELECTED_NODES', node)
    },
    deFocus() {
      this.$store.commit('network/SET_SELECTED_NODES', null)
    },
  },
}
</script>

<style scoped lang="postcss">
.home {
  @apply flex w-full h-full ;
}
</style>
