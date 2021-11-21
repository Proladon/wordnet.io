<template>
  <div class="input-pane" v-if="showPane">
    <input
      style="margin-right: 10px"
      type="text"
      placeholder="關鍵字"
      v-model="label"
    />
    <input
      style="margin-right: 10px"
      type="number"
      max="100"
      min="0"
      placeholder="字詞權重"
      v-model="closeness"
    />
    <button id="add-node-btn" @click="handleAddNode">新增節點</button>
  </div>
</template>

<script>
import NetNode from '@/factory/node'
import NetLink from '@/factory/link'
import { find } from 'lodash'
import { mapState } from 'vuex'
export default {
  name: 'InputPane',
  data: () => ({
    label: '',
    closeness: '',
  }),
  computed: {
    ...mapState('network', ['nodes', 'selectedNode']),
    ...mapState('layer', ['activatedLayer']),
    showPane() {
      let show = false
      if (this.activatedLayer === 1) show = true
      if (this.activatedLayer > 1 && this.selectedNode) show = true
      if (this.selectedNode) {
        if (this.activatedLayer === this.selectedNode.layer) show = false
        if (this.activatedLayer !== this.selectedNode.layer + 1) show = false
      }
      return show
    },
  },
  methods: {
    handleAddNode() {
      if (!this.label.trim())
        return this.$notify({
          type: 'warn',
          text: '請輸入關鍵字',
        })
      if (!this.closeness.trim())
        return this.$notify({
          type: 'warn',
          text: '請輸入字詞權重',
        })

      if (this.checkRepeatNode())
        return this.$notify({
          type: 'warn',
          text: '節點已存在',
        })

      this.addNode()
      this.addLink()

      this.label = ''
      this.closeness = ''
    },

    addNode() {
      const node = new NetNode(
        `${this.activatedLayer}-${this.label.trim()}`,
        this.label.trim(),
        Number(this.closeness),
        this.activatedLayer
      )
      this.$store.commit('network/ADD_NODES', node)
    },

    addLink() {
      if (!this.selectedNode || this.activatedLayer === 1) return
      const link = new NetLink(
        `${this.activatedLayer}-${this.label.trim()}`,
        this.selectedNode.id,
        ''
      )
      this.$store.commit('network/ADD_LINKS', link)
    },

    checkRepeatNode() {
      return Boolean(
        find(this.nodes, {
          id: `${this.activatedLayer}-${this.label.trim()}`,
          layer: this.activatedLayer,
        })
      )
    },
  },
}
</script>

<style scoped lang="postcss">
.input-pane {
  @apply bg-gray-500 p-5 m-5 rounded-md;
  @apply flex justify-center items-center;
}

#add-node-btn {
  @apply border-teal-400 border-1 rounded-md px-2 text-teal-400;
}
</style>
