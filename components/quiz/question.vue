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

// function shadesOfGreenToRed(steps: any) {
//   const colors = [];
//   const stepSize = 255 / (steps - 1); // Calculate the step size for red

//   for (let i = 0; i < steps; i++) {
//     const redValue = Math.round(i * stepSize); // Increase the red value
//     const greenValue = 255 - redValue; // Decrease the green value

//     const hexColor = `#${toHex(redValue)}${toHex(greenValue)}00`; // Construct the hexadecimal color
//     colors.push(hexColor);
//   }

//   return colors;
// }

// function toHex(value: any) {
//   const hex = value.toString(16); // Convert the value to hexadecimal
//   return hex.length === 1 ? '0' + hex : hex; // Add leading zero if necessary
// }

// // Example usage:
// const shades = shadesOfGreenToRed(temp.value);
// console.log(shades);

// const color = computed(() => {
//   if (temp.value < 10) return 'blue';
//   else if (temp.value < 20) return 'amber';
//   else if (temp.value < 30) return 'orange';
//   else return '#aa5500';
// });

onMounted(() => {
  countdawn.value = setInterval(() => {

    var minutes = Math.floor(temp.value / 60);
    var seconds = Math.floor(temp.value % 60);

    min.value = minutes < 10 ? `0${minutes}` : minutes
    sec.value = seconds < 10 ? `0${seconds}` : seconds

    // If the count down is finished stop 
    if (temp.value < 0) {
      clearInterval(countdawn.value);
    }
    temp.value--;
  }, 1000)

})



watch(temp, (newValue, oldValue) => {
  console.log('aaaaa', newValue)
  if (temp.value < 0) {
    useQuiz.startSubmit = true
    useQuiz.showTimer = false
  }
})

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
