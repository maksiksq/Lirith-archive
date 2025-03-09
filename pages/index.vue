<script setup lang="ts">
import {ref, onMounted, computed} from 'vue'
import Shelf from '../components/Shelf.vue';

import {saveShelf, deleteShelf, getShelf, getAllShelves, clearShelves} from "~/utils/indexedDB";


</script>


<template>
  <h1>hey</h1>
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
