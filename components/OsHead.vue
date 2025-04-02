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

// no idea what the type is so have this instead
type VueDragableEventIsh = {
  target: EventTarget & HTMLElement
  dx: number
  dy: number
}

const dragTab = (e: VueDragableEventIsh): void => {
  const target = e.target as HTMLElement;

  if (!target) return;

  const x = ref((parseFloat(target.getAttribute('data-x') ?? '0')) + e.dx)

  target.style.transform = `translateX(${x.value}px)`

  target.setAttribute('data-x', x.value.toString())
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

const makeEachTabDraggable = (): void => {
  nextTick(() => {
    tabElems.value?.forEach((tabElem: HTMLElement): void => {
      console.log(tabElem);
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
              move: dragTab,
            },
            cursorChecker: () => "default"
          })

    })
  });


}

onMounted(() => {
  makeEachTabDraggable();
})
//
//
</script>

<template>
  <header>
    <div class="header-cont">
      <div class="icon">
        <img src="../assets/img/lirith_moth.png" alt="icon" />
      </div>
      <div ref="tabsContainer" class="tabs" @wheel.prevent="scrollHorizontally">
        <div ref="tabElems" v-for="tab in tabs" class="tab" @click="switchToTab(tab)" >
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
  position: relative;
  .header-cont {
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;

    background-color: #131313;

    // linked to ui top
    height: 3.5vw;

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
        // in the future replace this with "im a very long tab na-..."
        overflow-x: hidden;

        min-width: 15vw;

        display: flex;
        align-content: flex-end;
        background-color: #0F0F0F;

        width: 15vw;
        margin-left: 0.3vw;
        margin-right: 0.3vw;
        height: 80%;

        border-radius: 6px 6px 0 0;



        p {
          margin-bottom: 1vw;
          pointer-events: none;
          user-select: none;
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
    position: absolute;
    left: 0;
    bottom: 0;

    height: 1vw;
    width: 100vw;
    background-color: #0F0F0F;

    border-bottom: 1px white solid;
  }
}
</style>