<script setup lang="ts">
import {ref, onMounted, computed, watch} from 'vue'
import Shelf from '~/components/Shelf.vue';

import { useRuntimeConfig } from '#imports';

import {saveShelf, deleteShelf, getShelf, getAllShelves, clearShelves} from "~/utils/indexedDB";

const shelves = ref([])

const size = ref(75)
const gridSize = ref(75)

const shelfData: any = ref([
  {
    id: 1,
    x: gridSize.value,
    y: gridSize.value*1,
    isRad: false,
    isIdkSomething: false,
  },
  {
    id: 2,
    x: gridSize.value,
    y: gridSize.value*2,
    isRad: false,
    isIdkSomething: false,
  },
  {
    id: 3,
    x: gridSize.value,
    y: gridSize.value*3,
    isRad: false,
    isIdkSomething: false,
  },
  {
    id: 4,
    x: gridSize.value,
    y: gridSize.value*4,
    isRad: false,
    isIdkSomething: false,
  }]
)



interface ShelfDataInterface {
  contents: any;
}

async function loadShelves(): Promise<any> {
  console.info('Loading shelves...')
  if (!import.meta.client) {
    return;
  }
  // Take the shelf from the DB, turn it into a real, tangible element
  //
  // Also, first take a bunch of eggs and sugar, whip the eggs and sugar
  // for about 7 minutes until they turn into a singular mass
  const receivedShelfData = ref<ShelfDataInterface | null>(await getShelf(1));
  if (!receivedShelfData.value) {
    console.log("no shelf detected in the database so loaded fallback (or just heat death of javascript nulls and some weird happening)")
    receivedShelfData.value = {contents: [
        {
          isRad: false,
          isIdkSomething: false,
        },
      ]};
  }
  console.log(receivedShelfData);
  console.info('Loaded shelves!')
}

async function handleTest(): Promise<void> {
  await saveShelf([
    {
      id: 4,
      x: gridSize.value,
      y: gridSize.value*4,
      isRad: false,
      isIdkSomething: false,
    }
  ], 4);
}

const scale = ref(1)
const translateX = ref(0)
const translateY = ref(0)
const isPanning = ref(false)
const startX = ref(0)
const startY = ref(0)

const canvas = ref<HTMLCanvasElement | null>(null)

const drawGrid = () => {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return
  const {width, height} = canvas.value
  ctx.clearRect(0, 0, width, height)

  gridSize.value = size.value * scale.value

  const offsetX = translateX.value % gridSize.value
  const offsetY = translateY.value % gridSize.value

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.lineWidth = 1

  ctx.beginPath()

  for (let x = offsetX; x < width; x += gridSize.value) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
  }

  for (let y = offsetY; y < height; y += gridSize.value) {
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

const screenX = ref(450)
const screenY = ref(450)

interface ShelfObject {
  shelfWrapper: HTMLElement | null;
}

interface ShelfDataObject {
  id: number;
  x: number;
  y: number;
  isRad: boolean;
  isIdkSomething: boolean;
}

async function updatePositions() {
  await nextTick();
  console.log("shelves")
  console.log(shelves.value)
  console.log("shelves")

  shelves.value.forEach((elObj: ShelfObject) => {
    const el: HTMLElement | null = elObj.shelfWrapper
    console.log(el)

    if (!el) {
      console.log("Something went horribly wrong. Run. Burn. Destroy.")
      return
    }

    // finds the shelf by its id, maybe I should've just used an array???
    function findCurrentShelfData(id: number) {
      const shelves = Object.values(shelfData.value) as ShelfDataObject[];
      return shelves.find(shelf => shelf.id === id);
    }

    // am i doing this sloppily
    const currentId: number = parseInt(el.id.at(-1) as string);
    const currentShelfData = findCurrentShelfData(currentId);

    if (currentShelfData === undefined) {
      console.info("something is wrong with the data, all hell broke loose.")
      return;
    }

    const worldX = worldElementPos.value.x + currentShelfData.x;
    const worldY = worldElementPos.value.y + currentShelfData.y;

    screenX.value = worldX * scale.value + translateX.value
    screenY.value = worldY * scale.value + translateY.value

    el.style.transform = `translate(${screenX.value}px, ${screenY.value}px) scale(${scale.value})`


  })
}



const items = ref([
  {name: "Test", id: 0},
  {name: "Teest", id: 1},
  {name: "Teeesst", id: 2},
],)


onMounted(async () => {
  if (!import.meta.client) {
    console.info('NOT RUNNING ON CLIENT (SOMEHOW)');
    return
  }
  if (import.meta.client) {
    console.info('Running on client)');
  }
  await loadShelves();

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
})

// future: Do not send the element itself to the db,
// instead just the data and render it all here live
</script>


<template>
  <div class="buttonWrap">
    <button @click="handleTest">add crimes</button>
    <button @click="loadShelves">initialize crimes</button>
  </div>
  <div class="grid-container" ref="grid"
       @mousedown="startPan"
       @wheel.prevent="zoom">
    <canvas ref="canvas"></canvas>
    <!--    this used to say "time to reinvent grid" before i reinvented grid-->
    <Shelf v-for="shelf in shelfData" ref="shelves" :key="shelf.id" :id="'shelf'+shelf.id.toString()" :items="items"></Shelf>
  </div>
</template>


<style scoped lang="scss">
// temp btn
.buttonWrap {
  display: flex;
  position: absolute;
  z-index: 99999;
  button {
    cursor: pointer;

    background-color: white;
    font-weight: bold;
    color: black;
    width: 150px;
    height: 100px;
  }

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
