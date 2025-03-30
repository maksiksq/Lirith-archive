<script setup lang="ts">
import {ref, onMounted, computed, watch} from 'vue'
import Shelf from '~/components/Shelf.vue';


import {saveShelf, deleteShelf, getShelf, getAllShelves, clearShelves} from "~/utils/indexedDB";
import LibraryFloatie from "~/components/LibraryFloatie.vue";

const shelves = ref([])

const size = ref(75)
const gridSize = ref(75)
const gridSizeUnscaled = ref(75)

const ifNumbered = ref(false);

interface ShelfDataObjectInterface {
  id: number;
  x: number;
  y: number;
  isRad: boolean;
  isIdkSomething: boolean;
}

const shelfData = ref<Array<ShelfDataObjectInterface>>([])

async function purge(): Promise<void> {
  console.info("Purged the db")
  await clearShelves();
  await loadShelves();
}

async function loadShelves(): Promise<any> {
  console.info('Loading shelves...')
  if (!import.meta.client) {
    return;
  }
  // Take the shelf from the DB, turn it into a real, tangible element
  //
  //
  // Also, first take a bunch of eggs and sugar, whip the eggs and sugar
  // for about 7 minutes until they turn into a singular mass
  const receivedShelfData = ref<Array<any> | null>(await getAllShelves());
  if (!receivedShelfData.value) {
    console.warn("no shelf detected in the database so loaded fallback (or just heat death of javascript nulls and some weird happening)")
    receivedShelfData.value = [
      {
        id: -999,
        x: gridSize.value,
        y: gridSize.value * 4,
        isRad: false,
        isIdkSomething: false,
      },
    ];
  }

  shelfData.value = [];
  for (const shelf of receivedShelfData.value) {
    shelfData.value.push(shelf.contents);
  }
  await updatePositions();
  console.info('Loaded shelves!')
}

async function findMaxShelfId(): Promise<number> {
  // importantly we load the shelves from the db when saving to ensure we're using the correct
  // version of the data
  await loadShelves();
  const ids: Array<number> = [];
  shelfData.value.forEach((shelf: ShelfDataObjectInterface) => {
    ids.push(shelf.id);
  })
  return Math.max(...ids);
}

async function addShelf(gridXPos: number | null, gridYPos: number | null, id: number | null = null): Promise<void> {
  const maxShelfId = ref(await findMaxShelfId());
  if (maxShelfId.value === -Infinity) {
    maxShelfId.value = 0;
  }

  if (gridXPos === null) {
    console.error("Oh noie, no gridXPos value found, defaulting to 1.")
    gridXPos = 1;
  }
  if (gridYPos === null) {
    console.error("Oh noie, no gridYPos value found, defaulting to 1.")
    gridYPos = 1;
  }

  const newShelf = {
    id: maxShelfId.value + 1,
    x: gridXPos,
    y: gridYPos,
    isRad: false,
    isIdkSomething: false,
  };

  console.log("noroi");
  console.log(newShelf.x, newShelf.y);

  await saveShelf(newShelf);
  await loadShelves();
}

const screenToWorld = (x: number, y: number): { wX: number; wY: number } => {
  const wX = Math.round((x - translateX.value) / gridSizeUnscaled.value);
  const wY = Math.round((y - translateY.value) / gridSizeUnscaled.value);
  return { wX, wY };
}

const scale = ref(1)
// global offset from 0 0
const translateX = ref(0)
const translateY = ref(0)
const isPanning = ref(false)
const startX = ref(0)
const startY = ref(0)

const canvas = ref<HTMLCanvasElement | null>(null)

function convertPosToGridCoords(x: number | null = null, y: number | null = null) {
  function determine(val: number | null) {
    if (val === null) return null;
    return Math.round(val/gridSize.value);
  }

  return {x: determine(x), y: determine(y)};
}

const drawGrid = ():void => {
  if (!canvas.value) return
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return
  const {width, height} = canvas.value
  ctx.clearRect(0, 0, width, height)

  gridSize.value = size.value * scale.value

  // offset
  const offsetX = translateX.value % gridSize.value;
  const offsetY = translateY.value % gridSize.value;

  if (offsetX === null || offsetY === null) {
    console.warn("oi")
    return;
  }
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.lineWidth = 1

  ctx.beginPath()

  for (let x = offsetX; x < width; x += gridSize.value) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    // make it dots instead of lines
    // ctx.fillRect(10,10,x,x);
  }

  for (let y = offsetY; y < height; y += gridSize.value) {
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
  }

  ctx.stroke()

  // adding coordinates to each cell
  if (ifNumbered.value) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = `${Math.max(10, gridSize.value / 4)}px Arial`;

    const gridCoords: {x: number | null, y: number | null} = convertPosToGridCoords(translateX.value, translateY.value);
    if (gridCoords.x === null || gridCoords.y === null) {
      return;
    }

    console.log("translates:", translateX.value, translateY.value);
    console.log(gridCoords);

    for (let x = offsetX; x < width; x += gridSize.value) {
      console.log("haii");
      //

      for (let y = offsetY; y < height; y += gridSize.value) {
        console.log("sleep", y, gridCoords.y)
        ctx.fillText(`${gridCoords.x-Math.round(x/gridSize.value)} ; ${gridCoords.y-Math.round(y/gridSize.value)}`, x + 5, y + 15);
      }
    }
  }

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
  console.log("click val")
  console.log(event.clientX, event.clientY)
  console.log("Translate val")
  console.log(translateX.value, translateY.value)
  console.log("Start val")
  console.log(startX.value, startY.value)
  window.addEventListener('mousemove', pan)
  window.addEventListener('mouseup', stopPan)
}//

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

const screenX = ref(0)
const screenY = ref(0)

interface ShelfObject {
  shelfWrapper: HTMLElement | null;
}

async function updatePositions() {
  await nextTick();

  shelves.value.forEach((elObj: ShelfObject) => {
    const el: HTMLElement | null = elObj.shelfWrapper

    if (!el) {
      console.warn("Something went horribly wrong. Run. Burn. Destroy.")
      return
    }

    // here we access the props from the HTMl element. Obscure-ish and not really meant for this?
    // like I care, matching it up with shelfData by picking a corresponding element by id
    // sounds unstable because it's kinda a two-way relationship, I'd much rather access it locally.
    //
    // also cfg that the data is stringified by HTML
    const currentShelfData = Object.fromEntries(Array.from(el.attributes, attr => [attr.name, attr.value]));



    const currentId: number = parseInt(currentShelfData.id);

    if (!currentShelfData) {
      console.warn("something is wrong with the data, all hell broke loose.")
      return;
    }

    // old
    //
    //     screenX.value = parseInt(currentShelfData.x)*gridSize.value;
    // screenY.value = parseInt(currentShelfData.y)*gridSize.value;

    // screenX.value = worldX * scale.value + translateX.value
    // screenY.value = worldY * scale.value + translateY.value

    const worldX = worldElementPos.value.x + parseInt(currentShelfData.x)*gridSizeUnscaled.value;
    const worldY = worldElementPos.value.y + parseInt(currentShelfData.y)*gridSizeUnscaled.value;

    screenX.value = worldX * scale.value + translateX.value
    screenY.value = worldY * scale.value + translateY.value

    el.style.transform = `translate(${screenX.value}px, ${screenY.value}px) scale(${scale.value})`
  })
}

// Items of each shelf for now just like this
const items = ref([
  {name: "Test", id: 0},
  {name: "Teest", id: 1},
  {name: "Teeesst", id: 2},
],)


onMounted(async () => {
  // clearShelves()

  if (!import.meta.client) {
    console.warn('NOT RUNNING ON CLIENT (SOMEHOW)');
    return
  }
  if (import.meta.client) {
    console.info('Running on client)');
  }
  await loadShelves();

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
})

interface dropPosInterface {
  dropX: number,
  dropY: number
}

const handleDroppedShelf = (pos: dropPosInterface): void => {
  const worldCoords = screenToWorld(pos.dropX, pos.dropY);

  console.log("scr to wrld");
  console.log(screenToWorld(pos.dropX, pos.dropY));

  console.log("original pos")
  console.log(pos.dropX, pos.dropY);
  console.log("grid coords")
  console.log(worldCoords)
  addShelf(worldCoords.wX, worldCoords.wY);
}

const enableCoordsOnGreed = (): void => {
  ifNumbered.value = !ifNumbered.value;

  drawGrid()
}

</script>

<template>
  <div class="buttonWrap">
    <button @click="enableCoordsOnGreed">enable crimes</button>
<!--    <button @click="loadShelves">initialize crimes</button>-->
<!--    <button @click="purge">clean the db</button>-->
<!--    <button @click="updatePositions">rerender</button>-->
<!--    <button @click="console.log(convertPosToGridCoords(null, 355))">convert coords</button>-->
  </div>
  <div class="ui-container">
    <LibraryFloatie @dropped-shelf="(pos) => {handleDroppedShelf(pos)}"></LibraryFloatie>
  </div>
  <div class="grid-container" ref="grid"
       @mousedown="startPan"
       @wheel.prevent="zoom">
    <canvas ref="canvas"></canvas>
    <!--    this used to say "time to reinvent grid" before i reinvented grid-->
    <Shelf v-for="shelf in shelfData" ref="shelves" :key="shelf.id" v-bind="shelf" :items="items"></Shelf>
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
  background-color: #0F0F0F;
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
