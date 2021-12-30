<template>
  <section class="layer-settings">
    <el-select v-model="order">
      <el-option v-for="option in options" :key="option" :value="option">{{option}}</el-option>
    </el-select>
  </section>
</template>

<script>
export default {
  name: 'LayerSettings',
  data: () => ({
    order: '',
    options: ['最相關', '隨機']
  })
}
</script>

<style>

</style>