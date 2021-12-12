<template>
  <el-dialog
    title="Warning"
    :visible.sync="show"
    @close="$emit('close')"
    width="30%"
  >
    <p class="warning">將會遺失當前工作階段，是否繼續?</p>

    <div slot="footer">
      <el-button type="danger" @click="confirm">Confirm</el-button>
      <el-button type="info" @click="$emit('close')">Cancel</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ImportWarningModal',
  data: () => ({
    show: true,
  }),
  methods: {
    confirm() {
      this.$emit('confirm')
      this.$emit('close')
    },
  },
}
</script>

<style lang="postcss" scoped>
.warning {
  @apply font-bold text-lg;
}
</style>
