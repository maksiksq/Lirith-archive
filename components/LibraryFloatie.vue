<script setup lang="ts">

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

</script>

<template>
    <div class="ui-floatie ui-floatie-library">
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