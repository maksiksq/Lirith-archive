<script setup lang="ts">
import {ref, onMounted, computed, watch} from 'vue'
import Shelf from '~/components/Shelf.vue';

import { useRuntimeConfig } from '#imports';

import {saveShelf, deleteShelf, getShelf, getAllShelves, clearShelves} from "~/utils/indexedDB";

const shelfData: any = ref({
  shelf1: {
    isRad: false,
    isIdkSomething: false,
  },
  shelf2: {
    isRad: false,
    isIdkSomething: false,
  },
  shelf3: {
    isRad: false,
    isIdkSomething: false,
  }
})

const elem1Content = ref<string>('')
const shelfElem = ref<HTMLElement | null>(null)

watch(shelfElem, (newVal) => {
  if (newVal) {
    const elChild = newVal.firstElementChild as HTMLElement;
    if (elChild) {
      trackedElems.push(elChild); // Now tracking the actual DOM element
      updatePositions(); // Apply transformations after it's mounted
    }
  }
});

interface ShelfData {
  contents: any;
}

async function loadShelves(): Promise<any> {
  console.log('Loading shelves...')
  if (!import.meta.client) {
    return;
  }
  // Take the shelf from the DB, turn it into a real, tangible element
  const shelf = ref<ShelfData | null>(await getShelf(1));
  if (!shelf.value) {
    shelf.value = {contents: {
        shelf0: {
          isRad: false,
          isIdkSomething: false,
        },
      }};
  }


}

async function handleTest(): Promise<void> {
  await saveShelf({
    isRad: false,
  }, 1);
}

const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const isPanning = ref(false)
const startX = ref(0)
const startY = ref(0)

const size = ref(75)

const canvas = ref<HTMLCanvasElement | null>(null)

const drawGrid = () => {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return
  const {width, height} = canvas.value
  ctx.clearRect(0, 0, width, height)

  const gridSize = size.value * scale.value

  const offsetX = translateX.value % gridSize
  const offsetY = translateY.value % gridSize

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.lineWidth = 1

  ctx.beginPath()

  for (let x = offsetX; x < width; x += gridSize) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
  }

  for (let y = offsetY; y < height; y += gridSize) {
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
  }

  ctx.stroke()
  updatePositions()
}

const resizeCanvas = () => {
  if (!canvas.value) return
  canvas.value.width = window.innerWidth;
  canvas.value.height = window.innerHeight;
  drawGrid()
}

const startPan = (event: any) => {
  if (event.button !== 1) return
  isPanning.value = true
  startX.value = event.clientX - translateX.value
  startY.value = event.clientY - translateY.value
  window.addEventListener('mousemove', pan)
  window.addEventListener('mouseup', stopPan)
}

const pan = (event: any) => {
  if (!isPanning.value) return
  translateX.value = event.clientX - startX.value
  translateY.value = event.clientY - startY.value
  drawGrid()
}

const stopPan = () => {
  isPanning.value = false
  window.removeEventListener('mousemove', pan)
  window.removeEventListener('mouseup', stopPan)
}

const zoom = (e: any) => {
  const zoomIntensity = 0.1
  const newScale = Math.min(3, Math.max(0.5, scale.value - e.deltaY * zoomIntensity * 0.01))
  scale.value = newScale
  drawGrid()
}

const worldElementPos = ref({x: 450, y: 450})

const trackedElems: Array<any> = reactive([])

const screenX = ref(450)
const screenY = ref(450)

function updatePositions() {
  const offsetX = ref(0)
  const offsetY = ref(0)
  trackedElems.forEach((el: HTMLElement, i) => {
    if (!el) return;

    // context: v-html always puts the thing in a wrapper
    // to avoid that we use the child
    const elChild = el.childNodes[0] as HTMLElement;
    if (!elChild) return;
    console.log(elChild)

    const worldX = worldElementPos.value.x + offsetX.value
    const worldY = worldElementPos.value.y + offsetY.value

    screenX.value = worldX * scale.value + translateX.value
    screenY.value = worldY * scale.value + translateY.value

    el.style.transform = `translate(${screenX.value}px, ${screenY.value}px) scale(${scale.value})`

    offsetX.value += 75;
  })
}



const items = ref([
  {name: "Test", id: 0},
  {name: "Teest", id: 1},
  {name: "Teesst", id: 2}
],)

// in the future i can do it for v-fors
const setElems = (el: HTMLElement) => {
  if (el) trackedElems.push(el);
};

const shelfComp = ref<HTMLCanvasElement | null>(null);

onMounted(async () => {
  if (!import.meta.client) {
    console.log('NOT RUNNING ON CLIENT (SOMEHOW)');
    return
  }
  if (import.meta.client) {
    console.log('Running on client)');
  }
  await loadShelves();

  console.log("he")
  // defs for elems manually for now
  // @ts-ignore
  const shelfWrapper: HTMLElement = shelfComp.value?.shelfWrapper;
  if (shelfWrapper) trackedElems.push(shelfWrapper);
  console.log(trackedElems)

  console.log("hee")

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
})

// future: Do not send the element itself to the db,
// instead just the data and render it all here live
</script>


<template>
  <div class="grid-container" ref="grid"
       @mousedown="startPan"
       @wheel.prevent="zoom">
    <canvas ref="canvas"></canvas>
    <div ref="shelfElem" v-if="elem1Content" v-html="elem1Content"></div>
    <button @click="handleTest"></button>
    <button @click="loadShelves"></button>
    <!--    this used to say "time to reinvent grid" before i reinvented grid-->
    <Shelf v-for="shelf in shelfData" ref="shelfComp" :items="items"></Shelf>
  </div>
</template>


<style scoped lang="scss">
// temp btn
button {
  position: relative;
  width: 150px;
  height: 100px;
}


// tbh i should use togglable classes so much more instead of inline styles
.grabbing {
  background-color: red !important;
  cursor: grabbing;
}

.grid-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-color: #222;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

// after adding the cherry on top, your cake is ready, you can also add
// some other toppings to your liking, thank you for seeing my cake recipe,
// share it on bluesky or something idk.
</style>
