<template>
  <div class="home">
    <LayerPane />

    <network
      :nodeList="nodes"
      :linkList="links"
      showLinkText
      @clear=";(nodes = []), (links = [])"
      @deleteNode="deleteNode"
      @clickNode="clickNode"
      @deFocus="selectedNode = null"
    />
  </div>
</template>

<script>
import LayerPane from "@/components/LayerPane.vue"
import Network from "@/components/Network"
import { filter, difference } from "lodash"
import { mapState } from "vuex"

export default {
  name: "Home",
  components: { LayerPane, Network },
  computed: {
    ...mapState("network", ["nodes", "links"]),
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
      this.inputVal = ""
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
  @apply grid grid-flow-col  w-full h-full overflow-hidden;
}
</style>
