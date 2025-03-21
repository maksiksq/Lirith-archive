<script setup lang="ts">

const tabs = ref([
  {name: "homeTab", path: "", home: true},
  {name: "exampleTab1", path: "", home: false},
  {name: "exampleTab2", path: "", home: false},
  {name: "exampleTab2", path: "", home: false},
  {name: "exampleTab2", path: "", home: false},
  {name: "exampleTab2", path: "", home: false},
  {name: "exampleTab2", path: "", home: false},
  {name: "exampleTab2", path: "", home: false},
  {name: "exampleTab2", path: "", home: false},
  {name: "exampleTab2", path: "", home: false},
  {name: "exampleTab2", path: "", home: false},
  {name: "exampleTab2", path: "", home: false},
])

</script>

<template>
  <header>
    <div class="icon">
      <p>a</p>
    </div>
    <div class="tabs">
      <div v-for="tab in tabs" class="tab">
        <p>b b b b b</p>
      </div>
    </div>
    <div class="OsButtonWrap">
      <p>c c c</p>
    </div>

  </header>
</template>

<style scoped lang="scss">
header {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;

  background-color: #131313;

  height: 4vh;

  div {
    height: 100%;

    display: flex;
    align-items: flex-end;
  }

  .icon {

  }

  .tabs {
    display: flex;
    flex-direction: row;

    .tab {
      display: flex;
      align-content: flex-end;
      background-color: #0F0F0F;

      border: solid 1px #757575;
      height: 80%;

      border-radius: 6px 6px 0 0;
    }
  }



  .OsButtonWrap {
    display: flex;
    flex-direction: row;

    margin-left: auto;
  }
}
</style>