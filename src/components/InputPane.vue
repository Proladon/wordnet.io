<template>
    <vs-card class="input-pane" :class="{'start-position': !nodes.length}" actionable v-if="showPane" >
      <div slot="header">
        <h3 class="text-gray-400">
          Add Node
        </h3>
      </div>
      <vs-input class="w-full"  placeholder="Enter Node Name" @keyup.enter="handleAddNode"  v-model="label" />
      <div slot="footer">
        <vs-row vs-justify="flex-end">
          <vs-button class="w-[100px]" color="success" type="gradient" @click="handleAddNode">Add</vs-button>
        </vs-row>
      </div>
    </vs-card>
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
      else if (this.activatedLayer > 1 && this.selectedNode) show = true
      else if (this.selectedNode) {
        if (this.activatedLayer === this.selectedNode.layer) show = false
        if (this.activatedLayer !== this.selectedNode.layer + 1) show = false
      }
      return show
    },
  },
  methods: {
    handleAddNode() {
      if (!this.label.trim()) return this.$vs.notify({
          icon: 'warning',
         title:'Notice',
         text:`Please enter node name`,
         color:'warning',
         position:'top-center',
      })

      if (this.checkRepeatNode()) return this.$message.warning('節點已存在')

      this.addNode()
      this.addLink()

      
      this.$vs.notify({
        icon: 'check',
         title:'New Node',
         text:this.label.trim(),
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
@apply absolute left-0 right-0 bottom-20 m-auto w-[500px] bg-gray-600 px-[20px];
}

.start-position {
  @apply bottom-[35%];
}

.input-container {
  @apply grid gap-[10px] grid-cols-2 w-full w-[500px];
}

.add-node-btn {
  @apply flex-shrink-0 ml-[10px] py-[7.5px] px-[10px] cursor-pointer rounded-md font-medium bg-emerald-300 text-center;
  @apply hover:bg-opacity-50;
  transition: 0.3s;
}

::v-deep .vs-inputx{
  @apply !text-center;
}
</style>
