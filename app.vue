<script setup lang="ts">

</script>
<template>
  <div>
    <NuxtLayout>
      <header>
        <!-- // later onwards gonna replace this with a custom window thing but for now just laying this out -->
      </header>
      <main>
        <NuxtPage/>
        <!-- 20x8 -->
      </main>

    </NuxtLayout>
  </div>
</template>
<style>
* {
  margin: 0;
  padding: 0;

  font-family: "Montserrat Thin", sans-serif;
  color: white;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

body, html {
  margin: 0;
  padding: 0;
  overflow: clip;
}

h1, h2, h3, h4, h5, h6, p {
  font-family: "Montserrat Thin", sans-serif;
  color: white;
}

</style>
<style scoped lang="scss">
main {
  background-color: #0F0F0F;
  width: 100vw;
  height: 100vh;
}
</style>