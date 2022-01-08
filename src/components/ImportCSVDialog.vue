<template>
  <!-- <el-dialog
    title="Import Data"
    :visible.sync="show"
    @close="$emit('close')"
    width="30%"
  >
    <vs-button
      class="w-full"
      type="success"
      @click="$refs['nodeImport'].click()"
      >Import Nodes</vs-button
    >
    <input
      class="hidden"
      @input="importCSV"
      ref="nodeImport"
      type="file"
      name=""
      id="import"
    />

    <vs-button
      class="w-full"
      type="success"
      @click="$refs['linkImport'].click()"
      >Import Links</vs-button
    >
    <input
      class="hidden"
      @input="importCSV"
      ref="linkImport"
      type="file"
      name=""
      id="import"
    />
  </el-dialog> -->

  <vs-prompt
    color="danger"
    :active.sync="activePrompt2"
    @cancel="valMultipe.value1='',valMultipe.value2=''"
    @accept="acceptAlert"
    @close="close"
  >
    <div class="con-exemple-prompt">
      Enter your first and last name to <b>continue</b>.
    </div>
  </vs-prompt>
</template>

<script>
import csv2json from 'csvjson-csv2json'
import { forEach } from 'lodash'
import NetNode from '@/factory/node'
export default {
  name: 'ImportCSVDialog',
  data: () => ({
    show: true,
  }),
  methods: {
    parseCSVData (data) {
      console.log(data)
      const list = []
      forEach(data, (item) => {
        const node = new NetNode(
          `1-${item.Label}`,
          item.Label,
          Number(item.closeness),
          1,
        )
        list.push(node)
      })

      this.$store.commit('network/SET_NODES', list)
    },

    importCSV (e) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        const csvArray = csv2json(reader.result, { parseNumbers: true })
        this.parseCSVData(csvArray)
      }
      reader.readAsText(file)
    },
  },
}
</script>

<style lang="postcss" scoped></style>
