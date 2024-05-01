<template>
  <!-- <div class=" relative w-[500px] mt-4">
    <svg :width="width" height="20">
      <rect width="100%" height="100%" fill="#ddd" rx="5" ry="5" />
      <rect :width="progress + '%'" height="100%" :fill="color" class="transition-all duration-1000 ease-linear" rx="5"
        ry="5" />
    </svg>
    <div
      :style="{ position: 'absolute', top: '-20px', left: progress + '%', transform: 'translateX(-50%)', transition: 'left 1s linear' }">
      {{ Math.round(progress) }}%
    </div>
  </div> -->

  <!-- <div class="m-6">
   <svg width="400" height="20">
     <rect  width="100%" height="100%" fill="#ddd" rx="15" ry="15" />
     <rect class="smooth" :width="progress + '%'" height="100%" :fill="color" rx="15" ry="15" />
   </svg>
 </div> -->


  <div class="timer">
    <div class="progress">
      <div :style="{ width: progress + '%' }" class="progress-bar"></div>
      <span class="progress-text">{{ temp }}</span>
    </div>
  </div>
</template>


<script setup lang="ts">

const useQuiz = useMyQuizStore();
const width = 500;
const temp = ref(width);
const totalDuration = ref(width);

const timeRemaining = ref(totalDuration.value);
const progress = ref(100);
const color = ref('green');
const countDownInterval = ref()
onMounted(() => {
  countDownInterval.value = setInterval(() => {
    if (temp.value > 0) {
      temp.value--;
      progress.value = (temp.value / totalDuration.value) * 100;
      updateColor();
    } else {
      clearInterval(countDownInterval.value);
      useQuiz.startSubmit = true;
      useQuiz.showTimer = false;
    }
  }, 1000);
});

onUnmounted(() => {
  clearInterval(countDownInterval.value);
});

function updateColor() {
  switch (true) {
    case progress.value > 85: color.value = 'green'; break;
    case progress.value > 65: color.value = 'lime'; break;
    case progress.value > 45: color.value = 'yellow'; break;
    case progress.value > 25: color.value = 'amber'; break;
    case progress.value > 15: color.value = 'orange'; break;
    default: color.value = 'red';
  }
}
</script>


<style scoped>
.smooth {
  transition-property: all;
  transition-timing-function: linear;
  transition-duration: 1000ms;
  overflow: hidden;
  background: transparent;

}


.timer {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 30px;
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
  transition: 1s cubic-bezier(0.4, 0, 0.6, 1);;
}

.timer .progress .progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}
</style>
