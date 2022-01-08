<script>
import csv2json from 'csvjson-csv2json'
import { forEach } from 'lodash'
import NetNode from '@/factory/node'

export default {
  name: 'CSV',
  data: () => ({ showImportWarningModal: false }),
  methods: {
    importNodes () {
      if (this.nodes.length) this.showImportWarningModal = true
      if (!this.nodes.length) this.$refs.nodeImport.click()
    },

    parseCSVData (data) {
      const list = []
      forEach(data, (item) => {
        const node = new NetNode({
          id: `1-${item.Label}`,
          label: item.Label,
          closeness: Number(this.closeness) || 0,
          layer: 1,
        })
        list.push(node)
      })
      return list
    },

    importCSV (e) {
      this.$store.commit('network/SET_NODES', [])
      this.$store.commit('network/SET_LINKS', [])

      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        const csvArray = csv2json(reader.result, { parseNumbers: true })
        const newNodes = this.parseCSVData(csvArray)
        this.$store.commit('network/SET_NODES', newNodes)
        this.$message.success('Import nodes success')
      }
      reader.readAsText(file)
    },
  },
}
</script>
