<template>
  <div class="home">
    <LayerPane />

    <splitpanes class="default-theme overflow-hidden">
      <pane :key="0" size="80">
        <div class="relative">
          <network
            :nodeList="nodes"
            :linkList="links"
            showLinkText
            nodeTextKey="label"
            @clear=";(nodes = []), (links = [])"
            @deleteNode="deleteNode"
            @clickNode="clickNode"
            @deFocus="selectedNode = null"
          />
          <InputPane class="absolute bottom-0 left-0 right-0" />
        </div>
      </pane>
      <pane :key="1" size="20">
        <div class="w-full h-full bg-gray-800 text-gray-600 p-5">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus
          itaque veniam unde. Sit obcaecati culpa, labore, similique assumenda
          illo nihil sunt porro sed a alias maxime fuga odit. Perspiciatis,
          ipsa?
        </div>
      </pane>
    </splitpanes>
  </div>
</template>

<script>
import LayerPane from '@/components/LayerPane.vue'
import InputPane from '@/components/InputPane.vue'
import Network from '@/components/Network'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import { filter, difference } from 'lodash'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  components: { LayerPane, Network, Splitpanes, Pane, InputPane },
  computed: {
    ...mapState('network', ['nodes', 'links']),
  },

  methods: {
    addNode() {
      if (!this.inputVal.trim() || !this.curLayer) return
      this.nodes.push({
        id: this.inputVal,
        group: this.curLayer,
      })
      if (this.curLayer > 1) {
        this.links.push({
          source: this.inputVal,
          target: this.selectedNode.id,
        })
      }
      this.inputVal = ''
    },

    deleteNode(node) {
      this.nodes.splice(node.index, 1)
      this.deleteRefLink(node)
    },

    deleteRefLink(node) {
      const removes = filter(this.links, (link) => {
        return link.source.id === node.id || link.target.id === node.id
      })

      this.links = difference(this.links, removes)
    },

    clickNode(e, node) {
      this.selectedNode = node
    },
  },
}
</script>

<style scoped lang="postcss">
.home {
  @apply flex w-full h-full;
}
</style>
