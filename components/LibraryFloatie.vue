<script setup lang="ts">
import interact from "interactjs";

const emit = defineEmits(["droppedShelf"])

const mainElem: HTMLElement | undefined = inject("mainElem");

// Static array for the shelf library entries
const library = ref([
  {name: "Text", id: 0},
  {name: "Icon", id: 1},
  {name: "Long", id: 2},
  {name: "Long to-do", id: 3},
  {name: "Switch", id: 4},
  {name: "Reminder", id: 5},
  {name: "Timer", id: 6},
])

const uiFloatieLibrary = ref<HTMLElement | null>(null)

const moveOnDrag = (e: any): void => {
  const target = e.target as HTMLElement;

  if (!target) return;

  const x = ref((parseFloat(target.getAttribute('data-x') ?? '0')) + e.dx)
  const y = ref((parseFloat(target.getAttribute('data-y') ?? '0')) + e.dy)

  target.style.transform = `translate(${x.value}px, ${y.value}px)`

  target.setAttribute('data-x', x.value.toString())
  target.setAttribute('data-y', y.value.toString())
}

const entry = ref([])

onMounted(() => {
  if (!mainElem) {
    console.warn("This error is not real. If the main does not exist everything exploded way before the inception of universe and the sfc right here. This line of code will probably never be run, left to rust and get washed away by rain in neverity. But TypeScript is happy, so let's all be happy and ignore this line, forever, period.")
    // it triggers and does so pretty often lmao
  }
  if (!uiFloatieLibrary.value) return;

  // i hate methods. Couldn't you just separate these. Nested pain.
  interact(uiFloatieLibrary.value)
      .draggable({
        inertia: false,
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: '.main',
            endOnly: true,
          })
        ],

        autoScroll: false,

        // makes it movable only using the top thingy
        allowFrom: ".libTabs",

        listeners: {
          move: moveOnDrag,
        }
      })

  // this keeps it working with translateY(-50%)
  const target = uiFloatieLibrary.value;
  const height = ref(target.offsetHeight);
  const y = ref((parseFloat(target.getAttribute('data-y') ?? '0') - height.value / 2))
  target.setAttribute('data-y', y.value.toString())

  entry.value.forEach((el: HTMLElement | null) => {
    if (!el) return;
    console.log(el)

    const initialX = 0;
    const initialY = 0;

    interact(el)
        .draggable({
          inertia: false,
          modifiers: [
            interact.modifiers.restrictRect({
              restriction: mainElem,
              endOnly: true,
            })
          ],

          autoScroll: false,

          listeners: {
            move: moveOnDrag,
            end(e) {
              const target = e.target as HTMLElement;

              target.style.transition = "transform 0.3s ease-out";
              target.style.transform = `translate(${initialX}px, ${initialY}px)`;

              setTimeout(() => {
                target.setAttribute('data-x', initialX.toString());
                target.setAttribute('data-y', initialY.toString());
                target.style.transition = "";
              }, 300);

              const dropX = e.clientX;
              const dropY = e.clientY;

              emit("droppedShelf", {dropX: dropX, dropY: dropY});
            }
          }
        })
  })


})

</script>

<template>
  <div ref="uiFloatieLibrary" class="ui-floatie ui-floatie-library">
    <div class="libTabs">
      <div>tab1</div>
      <div>&nbsp;tab2</div>
    </div>
    <div class="library">
      <div v-for="entry in library" ref="entry" class="entry"><p>aaa</p></div>
    </div>
  </div>

</template>

<style scoped lang="scss">
.ui-floatie-library {
  position: absolute;
  z-index: 99999;

  user-select: none;

  transform: translateY(-50%);
  top: 50%;
  right: 5vw;

  width: 20vw;
  height: 80vh;

  background-color: #161616;
  border-radius: 4px;
  border: 1px solid white;

  display: flex;
  flex-direction: column;

  transition: transform 0.1s cubic-bezier(0.25, 1, 0.5, 0.95);

  .libTabs {
    display: flex;
    flex-direction: row;
    align-items: flex-end;

    height: 6%;
    border-bottom: 1px solid white;
  }

  .library {
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    padding: 10px;
    gap: 15px;

    .entry {
      aspect-ratio: 1;

      background-color: #161616;
      border-radius: 8px;
      border: 3px solid white;
    }
  }
}
</style>