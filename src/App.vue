<template>
  <div id="app">
    <div class="my-5 flex justify-center gap-2">
      <span class="layer-btn" v-for="layer in curLayer" :key="layer"
        >Layer {{ layer }}</span
      >
      <span @click="curLayer += 1">addLayer {{ curLayer + 1 }}</span>
    </div>
    <div class="flex gap-2 justify-center">
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
    nodes: [
      // { id: 'Myriel', group: 1 },
      // { id: 'Napoleon', group: 1 },
      // { id: 'Labarre', group: 2 },
      // { id: 'Valjean', group: 2 },
      // { id: 'Myrielas', group: 3 },
    ],
    links: [
      // { source: 'Napoleon', target: 'Myriel', value: 1 },
      // { source: 'Valjean', target: 'Labarre', value: 1 },
      // { source: 'Napoleon', target: 'Valjean', value: 2 },
    ],
  }),
  methods: {
    addNode() {
      if (!this.inputVal.trim() || !this.curLayer) return
      this.nodes.push({
        id: this.inputVal,
        group: this.curLayer,
      })
      this.inputVal = ''
    },

    deleteNode(node) {
      this.nodes.splice(node.index, 1)
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
  @apply bg-orange-400 px-2;
}

.primary-input {
  @apply border-1 border-teal-400 rounded-md;
}

.primary-btn {
  @apply bg-teal-400 px-5;
}
</style>
