<script setup lang="ts">

const useQuiz = useMyQuizStore()
const temp = ref(useQuiz.time)
const max = useQuiz.time
const isTrue = ref(useQuiz.startTimer)
const color = computed(() => {
  switch (true) {
    case temp.value < 10: return 'blue'
    case temp.value < 20: return 'amber'
    case temp.value < 30: return 'orange'
    default: return 'red'
  }
})


// Assuming useQuiz is a reactive object
const countdawn = ref(); // Initialize with null

watch(isTrue,(newIsTrue) => {
  if (newIsTrue === true) {
    countdawn.value = setInterval(() => {
      temp.value--;
    }, 1000);
    console.log('1')
  }
  if (newIsTrue === false || temp.value < 0) {
    // Clear the interval if conditions are not met
    clearInterval(countdawn.value);
    temp.value = useQuiz.time
    countdawn.value = null; // Reset the interval reference
    console.log(countdawn.value)
    console.log('2')
    useQuiz.setStartTimer(null)
  }
});

const start = () => {
  useQuiz.startTimer = !useQuiz.startTimer
  console.log(useQuiz.startTimer)
}




</script>

<template>
  <UButton label="start" @click="start" />
  <UProgress :value="temp" :max="max" :color="color">
    <template #indicator="{ percent }">
      <div class="text-right" :style="{ width: `${percent}%` }">
        <!-- <span v-if="temp < 10" class="text-blue-500">Too cold!</span>
        <span v-else-if="temp < 20" class="text-amber-500">Warm</span>
        <span v-else-if="temp < 30" class="text-orange-500">Hot</span>
        <span v-else class="text-red-500 font-bold">🔥 Too hot! {{ temp }}</span> -->
        <span class="text-red-500 font-bold">🔥 Too hot! {{ temp }}</span>
      </div>
    </template>
  </UProgress>
</template>