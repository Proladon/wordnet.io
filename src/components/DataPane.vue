<template>
  <div class="data-pane">
    <section class="text-left">
      <p class="text-[20px] font-bold mb-[5px]">Node Data</p>
      <div class="info-block">
        <span class="label">ID:</span>
        <span>{{ selectedNode ? selectedNode.id : '' }}</span>
      </div>
      <div class="info-block">
        <span class="label">Label:</span>
        <span>{{ selectedNode ? selectedNode.label : '' }}</span>
      </div>
      <div class="info-block">
        <span class="label">Layer:</span>
        <span>{{ selectedNode ? selectedNode.layer : '' }}</span>
      </div>
      <div class="info-block">
        <span class="label">Closeness:</span>
        <span>{{ selectedNode ? selectedNode.closeness : '' }}</span>
      </div>
    </section>

    <hr class="my-4 border-gray-400">

    <section class="text-left">
      <p class="text-[20px] font-bold mt-[20px] mb-[5px]">Relations Nodes</p>
      <div>
        <div v-for="node in refNodeFilter" :key="node.id">
          {{ node.label }}
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { filter } from 'lodash'
export default {
  name: 'DataPane',
  computed: {
    ...mapState('network', ['selectedNode', 'links', 'refNodes']),
    refNodeFilter () {
      if (!this.selectedNode) return []
      const res = filter(
        this.refNodes,
        (node) => node.id !== this.selectedNode.id,
      )

      return res
    },
  },
}
</script>

<style scoped lang="postcss">
.data-pane {
  @apply min-w-[150px];
}
.info-block {
  @apply grid grid-cols-2 text-left text-emerald-300;

  .label {
    @apply font-medium text-gray-400;
  }
}
</style>
