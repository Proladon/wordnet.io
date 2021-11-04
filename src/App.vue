<template>
  <div></div>
</template>

<script setup>
import { onMounted } from "@vue/runtime-core"
import {
  select,
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
} from "d3"

const nodes = [
  { id: 0, reflexive: false },
  { id: 1, reflexive: true },
  { id: 2, reflexive: false },
]

const links = [
  { source: 0, target: 1 },
  { source: 0, target: 2 },
]

const HEIGHT = 500
const WIDTH = 500

onMounted(() => {
  const svg = select("#app")
    .append("svg")
    .on("contextmenu", () => {
      d3.event.preventDefault()
    })
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .attr("style", "border: 1px solid red;")

  const centerX = WIDTH / 2
  const centerY = HEIGHT / 2

  const force = forceSimulation(nodes)
    .force(
      "link",
      forceLink(links)
        .id((d) => d.id)
        .distance(150)
    )
    .force("charge", forceManyBody().strength(-1000))
    .force("center", forceCenter(centerX, centerY))

  const circles = svg
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", 15)

  const lines = svg
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke", "skyblue")

  const text = svg
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .text((node) => node.id)

  force.on("tick", () => {
    circles.attr("cx", (node) => node.x).attr("cy", (node) => node.y)
    text.attr("x", (node) => node.x + 20).attr("y", (node) => node.y)
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
