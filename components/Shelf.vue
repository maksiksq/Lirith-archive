<script setup lang="ts">
import draggable from "vuedraggable";
import {ref} from "vue";

const props = defineProps({
  items: Array,
})

function onDragStart(e: any) {
  e.item.style.cursor = "grabbing";
  e.item.style.zIndex = "9999";

}
function onDragEnd(e: any) {
  e.item.style.cursor = "grab";
}

// nifty
const shelfWrapper = ref(null)

defineExpose({
  shelfWrapper
});

const items = ref(props.items);


onMounted(() => {
  // no
})


</script>

<template>
  <div ref="shelfWrapper" class="shelf-wrapper">
    <div ref="shelf" class="shelf">
      <draggable
          v-model="items"
          item-key="id"
          class="shelf-inner"
          @start="onDragStart"
          @end="onDragEnd"
          :force-fallback="true"
      >
        <template #item="{ element }">
          <div class="shelf-item">{{ element.name }}</div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<style scoped lang="scss">
.shelf-wrapper {
  transform-origin: top left;
  .shelf {
    position: absolute;
    background-color: #161616;
    border-radius: 8px;

    width: 75px;
    height: 75px;
    // dimensions and positions in the js

    .shelf-inner {
      .shelf-item {
        width: 100%;
        background-color: yellow;
        color: black;

        z-index: 99;
        cursor: grab;
        user-select: none;
      }

      .shelf-item:nth-child(1) {
        border-radius: 8px 8px 0 0;
      }

      .shelf-item:last-child {
        border-radius: 0 0 8px 8px;
      }
    }


  }
}
</style>