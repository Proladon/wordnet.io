<template>
  <div class="home"></div>
</template>

<script>
export default {
  name: "Home",
  data: () => ({
    curLayer: 0,
  }),
  computed: {
    preLayer() {
      if (this.curLayer === 0) return 0
      return this.curLayer - 1
    },
    nextLayer() {
      return this.curLayer + 1
    },
  },
}
</script>

<style scoped lang="postcss"></style>
