<template>
  <div class="flex">
    <!-- <div class="w-[100px]">
      <p>Layer1</p>
    </div> -->
    <svg
      id="container"
      width="960"
      height="960"
      @contextmenu.prevent="nodes = []"
      @mousemove="drag($event)"
      @mouseup="drop()"
    >
      <circle
        v-for="(node, i) in nodes"
        :cx="coords[i].x"
        :cy="coords[i].y"
        :r="20"
        fill="#fcba03"
        stroke="white"
        stroke-width="1"
        @mousedown="
          currentMove = { x: $event.screenX, y: $event.screenY, node: node }
        "
      />
    </svg>
  </div>
</template>

<script setup>
import { ref, computed } from "@vue/reactivity"
import { onMounted } from "@vue/runtime-core"
import {
  select,
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCenter,
  forceX,
  forceY,
} from "d3"

const svg = ref(null)
const simulation = ref(null)
const width = ref(0)
const height = ref(0)
const nodes = ref([{ id: 1, x: 100, y: 100 }])
const links = ref([])
const centerX = computed(() => (width.value ? width.value / 2 : 0))
const centerY = computed(() => (height.value ? height.value / 2 : 0))
const currentMove = ref(null)

const coords = computed(() => {
  return nodes.value.map((node) => {
    return {
      x: node.x,
      y: node.y,
    }
  })
})

// const addNode = (e) => {
//   if (currentMove.value) return
//   nodes.value.push({
//     x: e.x,
//     y: e.y,
//   })
//   simulation.value.alpha(1)
//   simulation.value.restart()
// }
const drag = (e) => {
  console.log("drag")
  if (currentMove.value) {
    currentMove.value.node.fx =
      currentMove.value.node.x - (currentMove.value.x - e.screenX)
    currentMove.value.node.fy =
      currentMove.value.node.y - (currentMove.value.y - e.screenY)
    currentMove.value.x = e.screenX
    currentMove.value.y = e.screenY
  }
}

const drop = () => {
  console.log("drop")
  delete currentMove.value.node.fx
  delete currentMove.value.node.fy
  currentMove.value = null
  simulation.value.alpha(1)
  simulation.value.restart()
}

onMounted(() => {
  svg.value = select("#container")
  width.value = +svg.value.attr("width")
  height.value = +svg.value.attr("height")

  simulation.value = forceSimulation(nodes.value)
    .force(
      "charge",
      forceManyBody().strength((d) => -100)
    )
    // .force("x", forceX())
    // .force("y", forceY())
    .force("center", forceCenter(centerX.value, centerY.value))
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
