const network = {
  namespaced: true,
  state: {
    selectedNode: null,
    nodes: [
      // { id: "Myriel", group: 1 },
      // { id: "Napoleon", group: 1 },
      // { id: "test", group: 2 },
      // { id: "apple", group: 3 },
    ],
    links: [
      // { source: "test", target: "Myriel", value: 1 },
      // { source: "Napoleon", target: "test", value: 1 },
      // { source: "apple", target: "test", value: 2 },
    ],
  },
  mutations: {
    SET_SELECTED_NODES: (state, node) => {
      state.selectedNode = node
    },
    SET_NODES: (state, data) => {
      state.nodes = data
    },
    ADD_NODES: (state, node) => {
      state.nodes.push(node)
    },
    SET_LINKS: (state, data) => {
      state.links = data
    },
  },
}

export default network
