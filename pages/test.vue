<template>
 <div>
  <ArenaResults :max="max" :players="players"/>
 </div>
</template>


<script setup lang="ts">
const max = 10

const players = [
  { "name": "mary", "score": 150, "id": "ckr89q", "questions": 4 },
  { "name": "michael", "score": 140, "id": "gbl34s", "questions": 4 },
  { "name": "bob", "score": 135, "id": "esa47t", "questions": 2 },
  { "name": "jane", "score": 130, "id": "fta89k", "questions": 5 },
  { "name": "ahmed", "score": 123, "id": "asaewf", "questions": 3 },
  { "name": "chris", "score": 120, "id": "icd56t", "questions": 3 },
  { "name": "sara", "score": 115, "id": "hap12m", "questions": 7 },
  { "name": "alice", "score": 110, "id": "dpe23w", "questions": 6 },
  { "name": "paul", "score": 105, "id": "jef47u", "questions": 6 },
  { "name": "john", "score": 95, "id": "bsa34v", "questions": 5 }
];
</script>


<style scoped>

</style>
