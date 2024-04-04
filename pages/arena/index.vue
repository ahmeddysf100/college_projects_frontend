<script lang="ts" setup>
definePageMeta({
  middleware: ["auth-student"],
  layout: "default",
});

const showMain = ref(true)
const createArena = ref(false)
const joinArena = ref(false)
const toggleCreateArena = () => {
  showMain.value = false
  createArena.value = true
  // console.log(createArena.value)
}
const toggleJoinArena = () => {
  showMain.value = false
  joinArena.value = true
  // console.log(joinArena.value)
  
}
</script>


<template>
  <div v-if="showMain" class="grid grid-cols-2 place-content-center h-screen w-3/6 mx-auto gap-8 ">
    <h1 class=" col-span-2 text-xl font-bold text-center mb-4">WELCOME TO ARENA !</h1>
    <div class=" col-span-1  place-content-center">
      <UButton @click="toggleCreateArena" :ui="{ font: 'font-bold' }" size="xl" variant="outline"
        label="CREATE ARENA ⚔️ !" block />
    </div>
    <div class=" col-span-1  place-content-center">
      <UButton @click="toggleJoinArena" :ui="{ font: 'font-bold' }" size="xl" variant="outline" label="JOIN ARENA 🏹 !"
        block />
    </div>
  </div>
  <ArenaCreate v-if="createArena" />
  <ArenaJoin v-if="joinArena" />
</template>


<style></style>