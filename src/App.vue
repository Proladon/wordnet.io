<template>
  <div id="app">
    <input type="text" @keyup.enter="addNode" v-model="inputVal" />
    <network
      :nodeList="nodes"
      :linkList="links"
      showLinkText
      @clear=";(nodes = []), (links = [])"
    />
  </div>
</template>

<script>
// import Network from "vue-network-d3"
import Network from "@/components/Network"

export default {
  name: "App",
  components: {
    Network,
  },
  data: () => ({
    inputVal: "",
    nodes: [
      { id: "Myriel", group: 1 },
      { id: "Napoleon", group: 1 },
      { id: "Labarre", group: 2 },
      { id: "Valjean", group: 2 },
      { id: "Myrielas", group: 3 },
    ],
    links: [
      { source: "Napoleon", target: "Myriel", value: 1 },
      { source: "Valjean", target: "Labarre", value: 1 },
      { source: "Napoleon", target: "Valjean", value: 2 },
    ],
  }),
  methods: {
    addNode() {
      this.nodes.push({
        id: this.inputVal,
      })
      this.inputVal = ""
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
</style>
