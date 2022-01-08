class NetLink {
  constructor ({ source, target, label, weight }) {
    this.source = source
    this.target = target
    this.label = label
    this.weight = weight || 0
  }
}

export default NetLink
