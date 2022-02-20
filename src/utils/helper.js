export const updateSetting = function (key) {
  return {
    get () {
      return this.layerSettings[key]
    },
    set (value) {
      this.$store.commit('layer/SET_LAYER_SETTINGS', { key, value })
    },
  }
}

export const formatLabel = (label) => {
  if (!label) return ''
  return label.trim().toLowerCase().replaceAll(' ', '_')
}
