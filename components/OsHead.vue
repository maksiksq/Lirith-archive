<script setup lang="ts">

const tabs = ref([
  {name: "homeTab", tab: "", home: true},
  {name: "exampleTab1", tab: "", home: false},
  {name: "exampleTab2", tab: "", home: false},
  {name: "exampleTab2", tab: "", home: false},
  {name: "exampleTab2", tab: "", home: false},
  {name: "exampleTab2", tab: "", home: false},
  {name: "exampleTab2", tab: "", home: false},
  {name: "exampleTab2", tab: "", home: false}
])
// //
</script>

<template>
  <header>
    <div class="icon">
      <img src="https://placehold.co/64" alt="icon" />
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

  height: 2.5vw;

  div {
    height: 100%;

    display: flex;
    align-items: flex-end;
  }

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

    overflow-x: scroll;
    // fix scrollbar future maksiks
    .tab {
      display: flex;
      align-content: flex-end;
      background-color: #0F0F0F;

      width: 15vw;
      margin-left: 0.3vw;
      margin-right: 0.3vw;

      height: 80%;

      border-radius: 6px 6px 0 0;
    }

    .selected {
      border: solid 1px #757575;
    }
  }



  .OsButtonWrap {
    display: flex;
    flex-direction: row;

    margin-left: auto;
  }
}
</style>