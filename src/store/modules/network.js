const network = {
  namespaced: true,
  state: {
    nodes: [
      { id: "Myriel", group: 1 },
      { id: "Napoleon", group: 1 },
    ],
    links: [{ source: "Napoleon", target: "Myriel", value: 1 }],
  },
  mutations: {
    SET_NODES: (state, data) => {
      state.nodes = data
    },
    SET_LINKS: (state, data) => {
      state.links = data
    },
  },
}

export default network
