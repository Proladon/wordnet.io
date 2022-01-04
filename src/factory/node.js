class NetNode {
  constructor({id, label, closeness, layer}) {
    this.id = id
    this.label = label
    this.layer = layer
    this.closeness = closeness || 0
  }
}

export default NetNode
