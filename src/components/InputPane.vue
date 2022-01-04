<template>
<div class="input-pane" v-if="showPane">
    <vs-card actionable  class="bg-gray-600">
      <div slot="header">
        <h3 class="text-gray-400">
          New Node
        </h3>
      </div>
      <vs-input placeholder="關鍵字"  v-model="label" />
      <div slot="footer">
        <vs-row vs-justify="flex-end">
          <vs-button color="success" type="gradient" @click="handleAddNode">Add</vs-button>
        </vs-row>
      </div>
    </vs-card>
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
    closeness: 0,
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
      if (!this.label.trim()) return this.$message.warning('請輸入關鍵字')

      if (this.checkRepeatNode()) return this.$message.warning('節點已存在')

      this.addNode()
      this.addLink()

      
      this.$vs.notify({
        icon: 'check',
         title:'Add Node',
         text:`Success add new node - ${this.label.trim()}`,
         color:'success',
         position:'top-center',
      })

      this.label = ''
      this.closeness = 0
    },

    addNode() {
      const node = new NetNode({
        id: `${this.activatedLayer}-${this.label.trim()}`,
        label: this.label.trim(),
        closeness: Number(this.closeness),
        layer: this.activatedLayer
      })
      this.$store.commit('network/ADD_NODES', node)
    },

    addLink() {
      if (!this.selectedNode || this.activatedLayer === 1) return
      const link = new NetLink({
        source: `${this.activatedLayer}-${this.label.trim()}`,
        target: this.selectedNode.id,
        label: '',
      })
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
@apply p-[20px] grid place-content-end;
}

.input-container {
  @apply grid gap-[10px] grid-cols-2 w-full w-[500px];
}

.add-node-btn {
  @apply flex-shrink-0 ml-[10px] py-[7.5px] px-[10px] cursor-pointer rounded-md font-medium bg-emerald-300 text-center;
  @apply hover:bg-opacity-50;
  transition: 0.3s;
}
</style>
