export const updateSetting = function (key) {
  return {
    get() {
      return this.layerSettings[key]
    },
    set(value) {
      this.$store.commit('layer/SET_LAYER_SETTINGS', { key, value })
    },
  }
}