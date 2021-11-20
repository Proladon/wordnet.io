<template>
  <div class="input-pane">
    <input type="text" v-model="nodeData" />
    <button @click="addNode">新增節點</button>
  </div>
</template>

<script>
import NetNode from '@/factory/node'
import { find } from 'lodash'
import { mapState } from 'vuex'
export default {
  name: 'InputPane',
  data: () => ({
    nodeData: '',
  }),
  computed: {
    ...mapState('network', ['nodes']),
    ...mapState('layer', ['activatedLayer']),
  },
  methods: {
    addNode() {
      if (!this.nodeData.trim())
        return this.$notify({
          type: 'warn',
          text: '請輸入內容',
        })

      if (this.checkRepeatNode())
        return this.$notify({
          type: 'warn',
          text: '節點已存在',
        })

      const node = new NetNode(
        `${this.activatedLayer}-${this.nodeData.trim()}`,
        this.nodeData.trim(),
        this.activatedLayer
      )
      this.$store.commit('network/ADD_NODES', node)
      this.nodeData = ''
    },

    checkRepeatNode() {
      return Boolean(
        find(this.nodes, {
          id: `${this.activatedLayer}-${this.nodeData.trim()}`,
          group: this.activatedLayer,
        })
      )
    },
  },
}
</script>

<style scoped lang="postcss">
.input-pane {
  @apply bg-gray-500 p-5 m-5 rounded-md;
}
</style>
