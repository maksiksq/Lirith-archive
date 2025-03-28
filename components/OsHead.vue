<script setup lang="ts">

import interact from "interactjs";

interface tabInterface {
  name: string,
  id: number
}

const tabs = ref([
  {name: "homeTab", id: 0},
  {name: "calendarTab", id: -999},
  {name: "exampleTab1", id: 1},
  {name: "exampleTab1", id: 2},
  {name: "exampleTab1", id: 3},
  {name: "exampleTab1", id: 4},
  {name: "exampleTab1", id: 5},
  {name: "exampleTab1", id: 6},
  {name: "exampleTab1", id: 7},
  {name: "exampleTab1", id: 8},
  {name: "exampleTab1", id: 9},
])

const switchToTab = (tab: tabInterface): void => {
  // q PLACEHOLDER
}

const dragTab = (tab: tabInterface): void => {
  // q PLACEHOLDER
}

const tabsContainer = ref<HTMLElement | null>(null);
const tabElems = ref<Array<HTMLElement> | null>([]);

const scrollHorizontally = (e: WheelEvent): void => {
  if (!tabsContainer.value) {
    return;
  }

  if (e.deltaY !== 0) {
    e.preventDefault();
    tabsContainer.value.scrollBy({ left: e.deltaY * 2, behavior: "smooth" })
  }
}

onMounted(() => {
  tabElems.value?.forEach((tabElem: HTMLElement): void => {
    interact(tabElem)
        .draggable({
          inertia: false,
          modifiers: [
            interact.modifiers.restrictRect({
              restriction: 'parent',
              endOnly: true,
            })
          ],

          autoScroll: false,

          // makes it movable only using the top thingy
          allowFrom: ".tabs",

          listeners: {
            move: moveOnDrag,
          }
        })

  })
});


</script>

<template>
  <header>
    <div class="main-cont">
      <div class="icon">
        <img src="https://placehold.co/64" alt="icon" />
      </div>
      <div ref="tabsContainer" class="tabs" @wheel.prevent="scrollHorizontally">
        <div v-for="tab in tabs" class="tab" @click="switchToTab(tab)" >
          <p>b b b b b</p>
        </div>
      </div>
      <div class="OsButtonWrap">
        <p>c c c</p>
      </div>
    </div>
    <div class="puff"></div>
  </header>
</template>

<style scoped lang="scss">
header {
  .main-cont {
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;

    background-color: #131313;

    // linked to ui top
    height: 2.5vw;

    div {
      height: 100%;

      display: flex;
      align-items: flex-end;
    }
    //

    .icon {
      display: flex;
      justify-content: center;
      align-items: center;

      width: 2vw;
      img {
        padding-top: 0.3vw;

        width: 1vw;
        height: 1vw;
      }
    }

    .tabs {
      display: flex;
      flex-direction: row;

      overflow-x: auto;
      scroll-behavior: smooth;
      scrollbar-width: none;
      -ms-overflow-style: none;
      white-space: nowrap;

      .tab {
        min-width: 15vw;

        display: flex;
        align-content: flex-end;
        background-color: #0F0F0F;

        width: 15vw;
        margin-left: 0.3vw;
        margin-right: 0.3vw;

        height: 80%;

        border-radius: 6px 6px 0 0;

        cursor: pointer;

        .p {
          pointer-events: none;
        }
      }

      .selected {
        border: solid 1px #757575;
      }
    }

    .tabs::-webkit-scrollbar {
      width: 0;
      height: 0;
    }


    .OsButtonWrap {
      display: flex;
      flex-direction: row;

      margin-left: auto;
    }
  }
  .puff {
    height: 1vw;
    background-color: #0F0F0F;

    border-bottom: 1px white solid;
  }
}
</style>