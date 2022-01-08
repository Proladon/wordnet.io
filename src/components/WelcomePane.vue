<template>
  <div class="welcome-pane" v-if="!nodes.length">
    <div class="app-name">WordNet.io</div>
    
    <vs-card  actionable class="bg-gray-600">
      <div slot="header">Import Data</div>
      <vs-button class="px-[30px]"> Import CSV </vs-button>
    </vs-card>

    <div class="text-[20px]" >or</div>
  </div>
</template>

<script>import { mapState } from "vuex";

export default {
  name: 'WelcomePane',
  computed: {
    ...mapState('network', ['nodes'])
  }
}
</script>

<style scoped lang="postcss">
.welcome-pane {
  @apply absolute left-0 right-0 top-[27.5%] m-auto w-[500px];
  @apply text-gray-400 select-none ;
}

.app-name {
  @apply text-[30px] mb-[30px];
}
</style>