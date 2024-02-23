<script lang="ts" setup>
// Set the count down seconds
var countDownSeconds = 77;
const min = ref()
const sec = ref()

setTimeout(()=>{

  // Update the count down every 1 second
  var countdownFunction = setInterval(function() {
    
    // Time calculations for minutes and seconds
    var minutes = Math.floor(countDownSeconds / 60);
    var seconds = Math.floor(countDownSeconds % 60);
    min.value = minutes
    sec.value = seconds
 
    // Decrease the countDownSeconds by one every second
    countDownSeconds--;
    
    // If the count down is finished stop
    if (countDownSeconds < 0) {
      clearInterval(countdownFunction);
    }
  }, 1000);


  onMounted(()=>{
    clearInterval(countdownFunction)
    })


},1000)


</script>

<template>
  <UProgress :value="countDownSeconds" :max="77" color="red">
    <template #indicator="{ percent }">
      <div class="text-right" :style="{ width: `${percent}%` }">
        <span class="text-red-500 font-bold">🔥 Too hot! {{ min }}:{{ sec }}</span>
      </div>
    </template>
  </UProgress>
</template>
