<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
  layout: "default",
});

const showInsert = ref(true)
</script>

<template>
 <board :showInsert="showInsert"/>
</template>

<style></style>
