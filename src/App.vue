<template>
  <div class="flex">
    <div class="w-[100px]">
      <p>Layer1</p>
    </div>
    <svg id="container" width="960" height="960"></svg>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "@vue/runtime-core"
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

const svg = ref(null)
const simulation = ref(null)
const width = ref(0)
const height = ref(0)
const centerX = computed(() => (width.value ? width.value / 2 : 0))
const centerY = computed(() => (height.value ? height.value / 2 : 0))
const dragInteraction = ref(null)
const lines = ref(null)
const circles = ref(null)
const text = ref(null)
const count = ref(0)

onMounted(() => {
  svg.value = select("#container")
  width.value = +svg.value.attr("width")
  height.value = +svg.value.attr("height")

  simulation.value = forceSimulation(nodes.value)
    .force("charge", forceManyBody().strength(MANY_BODY_STRENGTH))
    .force(
      "link",
      forceLink(links.value).distance((link) => link.distance)
    )
    .force("center", forceCenter(centerX.value, centerY.value))

  dragInteraction.value = drag().on("drag", (event, node) => {
    node.fx = event.x
    node.fy = event.y
    simulation.value.alpha(1)
    simulation.value.restart()
  })

  const lines = svg.value
    .selectAll("line")
    .data(links.value)
    .enter()
    .append("line")
    .attr("stroke", (link) => link.color || "black")

  const circles = svg.value
    .selectAll("circle")
    .data(nodes.value)
    .enter()
    .append("circle")
    .attr("fill", (node) => node.color || "gray")
    .attr("r", (node) => node.size)
    .call(dragInteraction.value)

  const text = svg.value
    .selectAll("text")
    .data(nodes.value)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("alignment-baseline", "middle")
    .style("pointer-events", "none")
    .text((node) => node.id)

  simulation.value.on("tick", () => {
    if (!simulation.value | !svg.value) return
    circles.value.attr("cx", (node) => node.x).attr("cy", (node) => node.y)
    text.value.attr("x", (node) => node.x).attr("y", (node) => node.y)

    lines.value
      .attr("x1", (link) => link.source.x)
      .attr("y1", (link) => link.source.y)
      .attr("x2", (link) => link.target.x)
      .attr("y2", (link) => link.target.y)
  })
})
</script>
