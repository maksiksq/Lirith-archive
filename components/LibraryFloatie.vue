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
  <div class="ui-container">
    <div class="ui-floatie ui-floatie-library">
      <div v-for="entry in library" class="entry">beans</div>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>