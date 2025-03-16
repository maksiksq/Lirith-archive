<script setup lang="ts">
import interact from "interactjs";

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

function moveOnDrag(e: any) {
  const target = e.target as HTMLElement;

  if (!target) return;

  const x = ref((parseFloat(target.getAttribute('data-x') ?? '0')) + e.dx)
  const y = ref((parseFloat(target.getAttribute('data-y') ?? '0')) + e.dy)

  target.style.transform = 'translate(' + x.value + 'px, ' + y.value + 'px)'

  target.setAttribute('data-x', x.value)
  target.setAttribute('data-y', y.value)
}

onMounted(() => {
  if (!uiFloatieLibrary.value) return;

  // i hate methods. Couldn't you just separate these. Nested pain.
  interact(uiFloatieLibrary.value)
      .draggable({
        inertia: true,
        modifiers: [
            interact.modifiers.restrictRect({
              restriction: 'parent',
              endOnly: true,
            })
        ],

        autoScroll: false,

        listeners: {
          move: moveOnDrag,
          end (event) {
            var textEl = event.target.querySelector('p')

            textEl && (textEl.textContent =
                'moved a distance of ' +
                (Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
                    Math.pow(event.pageY - event.y0, 2) | 0))
                    .toFixed(2) + 'px')
          }
        }
      })
})

</script>

<template>
    <div ref="uiFloatieLibrary" class="ui-floatie ui-floatie-library">
      <div class="tabs">
        <div>tab1</div>
        <div>&nbsp;tab2</div>
      </div>
      <div class="library">
        <div v-for="entry in library" class="entry"><p>aaa</p></div>
      </div>
    </div>
</template>

<style scoped lang="scss">
.ui-floatie-library {
  position: absolute;
  z-index: 99999;

  transform: translateY(-50%);
  top: 50%;
  right: 5vw;

  width: 30vw;
  height: 80vh;

  background-color: #161616;
  border-radius: 4px;
  border: 3px solid white;

  display: flex;
  flex-direction: column;

  .tabs {
    display: flex;
    flex-direction: row;
    align-items: flex-end;

    height: 6%;
    border-bottom: 3px solid white;
  }

  .library {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    gap: 10px;

    .entry {
      flex-basis: calc(100%/3 - 10px);
      aspect-ratio: 1;
    }
  }
}
</style>