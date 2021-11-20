<template>
  <div class="input-pane">
    <input type="text" v-model="nodeData" />
    <button @click="addNode">新增節點</button>
  </div>
</template>

<script>
import NetNode from '@/factory/node'
export default {
  name: 'InputPane',
  data: () => ({
    nodeData: '',
  }),
  methods: {
    addNode() {
      const node = new NetNode(this.nodeData, 1)
      this.$store.commit('network/ADD_NODES', node)
      this.nodeData = ''
    },
  },
}
</script>

<style scoped lang="postcss">
.input-pane {
  @apply bg-gray-500 p-5 m-5 rounded-md;
}
</style>
