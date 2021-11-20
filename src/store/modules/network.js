const network = {
  namespaced: true,
  state: {
    selectedNode: null,
    nodes: [
      // { id: 'Myriel', label: 'Myriel', layer: 1, class: 1 },
      // { id: 'Napoleon', label: 'Napoleon', layer: 1, class: 1 },
      // { id: 'test', label: 'test', layer: 2, class: 2 },
      // { id: 'test2', label: 'test2', layer: 3, class: 3 },
    ],
    links: [
      // { source: 'test', target: 'Myriel', label: 1 },
      // { source: 'Napoleon', target: 'test', label: 1 },
      // { source: 'test2', target: 'test', label: 2 },
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
    ADD_LINKS: (state, link) => {
      state.links.push(link)
    },
  },
}

export default network
