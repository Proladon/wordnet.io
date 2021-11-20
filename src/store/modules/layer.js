const layer = {
  namespaced: true,
  state: {
    totalLayer: 0,
    activatedLayer: 0,
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
