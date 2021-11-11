<template>
  <div id="app">
    <div class="my-5 flex justify-center gap-2">
      <span
        class="layer-btn"
        :class="{ avtivated: activatedLayer === layer }"
        v-for="layer in curLayer"
        :key="layer"
        @click="selectLayer(layer)"
        >Layer {{ layer }}</span
      >
      <span @click="addLayer">addLayer {{ curLayer + 1 }}</span>
    </div>
    <div
      class="flex gap-2 justify-center"
      v-if="selectedNode || curLayer === 1"
    >
      <input
        class="primary-input"
        type="text"
        @keyup.enter="addNode"
        v-model="inputVal"
      />
      <button class="primary-btn" @click.prevent="addNode">ADD</button>
    </div>
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
// import Network from "vue-network-d3"
import Network from '@/components/Network'

export default {
  name: 'App',
  components: {
    Network,
  },
  data: () => ({
    inputVal: '',
    curLayer: 0,
    activatedLayer: null,
    selectedNode: null,
    nodes: [
      // { id: 'Myriel', group: 1 },
    ],
    links: [
      // { source: 'Napoleon', target: 'Myriel', value: 1 },
      // { source: 'Napoleon', target: 'Valjean', value: 2 },
    ],
  }),
  methods: {
    addNode() {
      if (!this.inputVal.trim() || !this.curLayer) return
      this.nodes.push({
        id: this.inputVal,
        group: this.activatedLayer,
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
    },

    clickNode(e, node) {
      this.selectedNode = node
    },

    addLayer() {
      this.curLayer += 1
      this.activatedLayer = this.curLayer
    },

    selectLayer(layer) {
      this.activatedLayer = layer
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.layer-btn {
  @apply bg-gray-300 px-2 cursor-pointer;
}

.primary-input {
  @apply border-1 border-teal-400 rounded-md px-5;
}

.primary-btn {
  @apply bg-teal-400 px-5;
}

.avtivated {
  @apply bg-teal-400;
}
</style>
