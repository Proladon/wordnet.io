const layer = {
  namespaced: true,
  state: {
    generating: false,
    totalLayer: 1,
    activatedLayer: 1,
    layerSettings: {
      generate: '最相關',
      source: 'conceptNet'
    }
  },
  mutations: {
    SET_GENERATING: (state, status) => {
      state.generating = status
    },
    SET_ACTIVATED_LAYER: (state, layer) => {
      state.activatedLayer = layer
    },
    SET_TOTAL_LAYER: (state, layer) => {
      state.totalLayer = layer
    },
    SET_LAYER_SETTINGS: (state, {key, value}) => {
      state.layerSettings[key] = value
    }
  },
}

export default layer
