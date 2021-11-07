<template>
  <div class="flex">
    <div class="w-[100px]">
      <p>Layer1</p>
    </div>
    <svg id="container" width="960" height="960"></svg>
  </div>
</template>

<script setup>
import { onMounted } from "@vue/runtime-core"
import {
  select,
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
  drag,
} from "d3"
import useNode from "./factory/useNode"

const {
  colors,
  nodes,
  links,
  MAIN_NODE_SIZE,
  CHILD_NODE_SIZE,
  LEAF_NODE_SIZE,
  DEFAULT_DISTANCE,
  MAIN_NODE_DISTANCE,
  LEAF_NODE_DISTANCE,
  MANY_BODY_STRENGTH,
  addMainNode,
  addChildNode,
  assembleChildNode,
  connectMainNodes,
  addFirstLayerNode,
} = useNode()

onMounted(() => {
  const svg = select("#container")
  const width = +svg.attr("width")
  const height = +svg.attr("height")
  const centerX = width / 2
  const centerY = height / 2

  const simulation = forceSimulation(nodes.value)
    .force("charge", forceManyBody().strength(MANY_BODY_STRENGTH))
    .force(
      "link",
      forceLink(links.value).distance((link) => link.distance)
    )
    .force("center", forceCenter(centerX, centerY))

  const dragInteraction = drag().on("drag", (event, node) => {
    node.fx = event.x
    node.fy = event.y
    simulation.alpha(1)
    simulation.restart()
  })

  const lines = svg
    .selectAll("line")
    .data(links.value)
    .enter()
    .append("line")
    .attr("stroke", (link) => link.color || "black")

  const circles = svg
    .selectAll("circle")
    .data(nodes.value)
    .enter()
    .append("circle")
    .attr("fill", (node) => node.color || "gray")
    .attr("r", (node) => node.size)
    .call(dragInteraction)

  const text = svg
    .selectAll("text")
    .data(nodes.value)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("pointer-events", "none")
    .text((node) => node.id)

  simulation.on("tick", () => {
    circles.attr("cx", (node) => node.x).attr("cy", (node) => node.y)
    text.attr("x", (node) => node.x).attr("y", (node) => node.y)

    lines
      .attr("x1", (link) => link.source.x)
      .attr("y1", (link) => link.source.y)
      .attr("x2", (link) => link.target.x)
      .attr("y2", (link) => link.target.y)
  })
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
