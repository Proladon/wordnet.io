const layer = {
  namespaced: true,
  state: {
    totalLayer: 1,
    activatedLayer: 1,
  },
  mutations: {
    SET_ACTIVATED_LAYER: (state, layer) => {
      state.activatedLayer = layer
    },
    SET_TOTAL_LAYER: (state, layer) => {
      state.totalLayer = layer
    },
  },
}

export default layer
