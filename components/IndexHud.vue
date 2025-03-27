<script setup lang="ts">

import LibraryFloatie from "~/components/LibraryFloatie.vue";
</script>

<template>
  <!--
    probably a side bar or two later on here, im not entirely sure yet,
    it depends on how it all goes ig
  -->
  <div class="ui-container">
    <LibraryFloatie></LibraryFloatie>
  </div>

</template>

<style scoped lang="scss">
.ui-container {
  width: 100%;
  height: 100%;


  position: absolute;
  top: 2.5vw;
  left: 0;

  background-color: transparent;
}
</style>