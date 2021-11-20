const network = {
  namespaced: true,
  state: {
    selectedNode: null,
    nodes: [
      // { id: 'Myriel', label: 'Myriel', group: 1, class: 1 },
      // { id: 'Napoleon', label: 'Napoleon', group: 1, class: 1 },
      // { id: 'test', label: 'test', group: 2, class: 2 },
      // { id: 'test2', label: 'test2', group: 3, class: 3 },
    ],
    links: [
      // { source: 'test', target: 'Myriel', value: 1 },
      // { source: 'Napoleon', target: 'test', value: 1 },
      // { source: 'test2', target: 'test', value: 2 },
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
