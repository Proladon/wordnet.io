export const circlesAll = (svg, nodes, dragging) => {
  return svg
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", 15)
    .call(dragging)
    .on("click", (e, node) => {
      // select link
      nodes.push({ id: 3, reflexive: false, x: 30 })
      svg.append("circle").attr("r", 15)
    })
}

export const linesAll = (svg, links) => {
  return svg
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke", "skyblue")
}

export const textAll = (svg, nodes) => {
  return svg
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .text((node) => node.id)
    .style("pointer-events", "none")
}
