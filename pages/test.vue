<template>
  <h1 class="font-extrabold text-pretty text-3xl text-center">Waiting for players to return. Only the admin can kick
    offline
    players...</h1>
  <div class="centerDevXY flex flex-wrap justify-center">
    <ArenaWaitForPlayers v-for="(item, index) in offlinePlayers" :key="index" @remove_participant="remove_participant"
      :offlinePlayer="item" />
  </div>
</template>


<script setup lang="ts">

const remove_participant = (x: any) => {
  console.log(`remove_participant: ${x.name}`)
}

const offlinePlayers = ref([
  { "id": "nCzQxk3LY938ETKWNpXHp", "name": "student" },
  { "id": "vYRpN85AGpZu4MzBEG4uH", "name": "teacher" },
  { "id": "Z7fKgEa6JTBWwL98aDr4T", "name": "parent" },
  { "id": "Rn6D4MzHk3XhLTuPNZ8aY", "name": "manager" },
  { "id": "C92B3hNz6LmETWxkqXPHp", "name": "engineer" },
  { "id": "aYDz6jWQpNcXLK3mTP89H", "name": "artist" },
  { "id": "8ZxL3HmNcpWQjY4TPK7Ba", "name": "developer" },
  { "id": "4X7YjN8cZa9pWQLTKm3bH", "name": "designer" },
  { "id": "nTj8bH3cW9mKXLYZaPp4Q", "name": "writer" },
  { "id": "cYjWmK3LNpQaT9H4Z8Xb7", "name": "scientist" },
  { "id": "L3ZKNxTpXbWmYc9PH4a7j", "name": "doctor" },
  { "id": "N6ZcLYpQ3HWmTXbKa8j9d", "name": "nurse" },
  { "id": "K4LWQmN3THXbpcZjY7a9d", "name": "pilot" },
  { "id": "qNcXK3WpHmLTZ8aYPb94j", "name": "chef" },
  { "id": "jWpLN4cTQKXb9aPmHY3Z8", "name": "athlete" },
  { "id": "pN3cY4KW9LXbqTHm8HaZj", "name": "musician" },
  { "id": "H4LYj3Xb9aKWmPQTLcZN8", "name": "actor" },
  { "id": "T9pNcYmLWjHXb4Q3K7Za8", "name": "dancer" },
  { "id": "mW3LXbHKc9NjZaP8Qp7T4", "name": "architect" },
  { "id": "N3mKcZp8WYjTXbLaHP94q", "name": "entrepreneur" }
]);
</script>


<style scoped>
/* .centerDevXY { */
/* position: absolute; */
/* top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
/* font-size: 5rem; */
/* Adjust font size as needed */
/* } */
</style>
