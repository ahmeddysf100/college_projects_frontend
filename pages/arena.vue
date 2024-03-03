<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
  layout: "default",
});

const showInsert = ref(false)
</script>


<template>
  <div>
    <board :showInsert="showInsert" />
  </div>
</template>


<style></style>