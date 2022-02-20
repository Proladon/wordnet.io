<template>
  <vs-prompt
    title="Warning"
    color="danger"
    :active.sync="show"
    @cancel="close"
    @accept="confirm"
    @close="close"
  >
    <div class="con-exemple-prompt">
      <vs-alert color="danger" icon="new_releases">
        Confirm delete Layer {{ layer }} ?
      </vs-alert>
    </div>
  </vs-prompt>
</template>

<script>
export default {
  name: 'DeleteLayerWarningModal',
  props: ['layer'],
  data: () => ({
    show: true,
  }),
  methods: {
    confirm () {
      this.$emit('confirm', this.layer)
      this.$emit('close')
    },
    close () {
      this.show = false
      setTimeout(() => {
        this.$emit('close')
      }, 300)
    },
  },
}
</script>

<style lang="postcss" scoped>
.warning {
  @apply font-bold text-lg;
}
</style>
