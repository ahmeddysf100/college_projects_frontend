<script lang="ts" setup>
const useQuiz = useMyQuizStore()

const rawData: any = computed(() => useQuiz.questions)

if (rawData[0].correctAnswer) {
  console.log('aaaaaaaaaaaaaa')
}

</script>

    
<template>
  <div>
    <UTextarea v-if="rawData" v-model="rawData" readonly autoresize />
    <div class=""></div>
  </div>
</template>


<style></style>