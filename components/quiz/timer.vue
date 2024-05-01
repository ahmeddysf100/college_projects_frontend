<script lang="ts" setup>
import type { progress } from '@nuxt/ui';



const useQuiz = useMyQuizStore();
const isTrue = computed(() => useQuiz.startTimer);
const countdawn = ref()
useQuiz.startSubmit = false
const temp = ref(useQuiz.time);
const min = ref()
const max = ref(useQuiz.time);
const sec = ref()
const progress = ref(100)

const color = computed(() => {
  switch (true) {
    case temp.value < max.value * 0.85: return 'yellow'
    case temp.value < max.value * 0.65: return 'orange'
    case temp.value < max.value * 0.45: return 'red'
    default: return 'green'
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
    progress.value = (temp.value/max.value)*100
  }, 1000)



})

onUnmounted(() => {
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
  <!-- <UProgress :value="temp" :max="max" :color="color" >
    <template #indicator="{ percent }">
      <div class="text-right " :style="{ width: `${percent}%` }">
        <span v-if="temp < max * 0.85" class="text-yellow-500 font-bold">Too cold! {{ min }}:{{ sec }}</span>
        <span v-else-if="temp.value < max * 0.65" class="text-orange-500 font-bold">Warm {{ min }}:{{ sec }}</span>
        <span v-else-if="temp.value < max * 0.45" class="text-red-500 font-bold">Hot {{ min }}:{{ sec }}</span>
        <span v-else class="text-green-500 font-bold">{{ min }}:{{ sec }}</span>
      </div>
    </template>
  </UProgress> -->

  <div class="timer mt-4">
    <div class="progress">
      <div :style="{ width: progress + '%' }" class="progress-bar"></div>
      <span class="progress-text">{{ min }}:{{ sec }}</span>
    </div>
  </div>


</template>

<style scoped>
.smooth {
  transition-property: all;
  transition-duration: 1000ms;
  transition-timing-function: linear;
}

.timer {
  width: 100%;
  /* height: 100px; */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  /* margin-bottom: 30px; */
}

.timer .progress {
  position: relative;
  width: 100%;
  height: 40px;
  background: transparent;
  border-radius: 30px;
  overflow: hidden;
  margin-bottom: 10px;
  border: 3px solid #3f4868;
}

.timer .progress .progress-bar {
  height: 100%;
  border-radius: 30px;
  overflow: hidden;
  background: linear-gradient(to right, #ea517c, #b478f1);
  transition: 1s linear;
}

.timer .progress .progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 20px;
  font-weight: bolder;
}
</style>
