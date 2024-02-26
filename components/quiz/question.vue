<script lang="ts" setup>


const useQuiz = useMyQuizStore();
const isTrue = computed(() => useQuiz.startTimer);
const countdawn = ref()
useQuiz.startSubmit = false
const temp = ref(useQuiz.time);
const min = ref()
const max = temp.value;
const sec = ref()

const color = computed(() => {
  switch (true) {
    case temp.value < max * 0.85: return 'green'
    case temp.value < max * 0.65: return 'lime'
    case temp.value < max * 0.45: return 'yellow'
    case temp.value < max * 0.25: return 'amber'
    case temp.value < max * 0.15: return 'orange'
    case temp.value < max * 0.5: return 'red'
    default: return 'emerald'
  }
})


onMounted(() => {
  countdawn.value = setInterval(() => {
    
    var minutes = Math.floor(temp.value / 60);
    var seconds = Math.floor(temp.value % 60);
    
    min.value = minutes < 10 ? `0${minutes}` : minutes
    sec.value = seconds < 10 ? `0${seconds}` : seconds
    
    // If the count down is finished stop 
    if (temp.value < 0) {
      clearInterval(countdawn.value);
      useQuiz.startSubmit = true
      useQuiz.showTimer = false
    }
    temp.value--;
  }, 1000)
  
})

onUnmounted(()=>{
  clearInterval(countdawn.value);
})


// watch(temp, (newValue, oldValue) => {
//   console.log('aaaaa', newValue)
//   if (temp.value < 0) {
//     useQuiz.startSubmit = true
//     useQuiz.showTimer = false
//   }
// })

</script>

<template>
  <UProgress :value="temp" :max="max" :color="color">
    <template #indicator="{ percent }">
      <div class="text-right " :style="{ width: `${percent}%` }">
        <span class="text-red-500 font-bold">🔥 Too hot! {{ min }}:{{ sec }}</span>
      </div>
    </template>
  </UProgress>
</template>
