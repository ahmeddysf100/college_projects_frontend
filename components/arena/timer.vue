<template>
  <div class="base-timer">
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
        <path :stroke-dasharray="circleDasharray" class="base-timer__path-remaining" :class="remainingPathColor" d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
          "></path>
      </g>
    </svg>
    <div class="base-timer__label">{{ formattedTimeLeft }}
      <!-- <br> -->
       <span class=" text-4xl font-semibold text-green-400" >{{ timeString }}</span> 
      
    </div>
  </div>
</template>

<script lang="ts" setup>
const useArena = useArenaStore()

const timeString = ref('GO!')
const TIME_LIMIT = ref(useArena.arena_updated_data?.roundTime as number);
console.log(TIME_LIMIT)
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = +(TIME_LIMIT.value / 2).toFixed();
const ALERT_THRESHOLD = +(TIME_LIMIT.value / 4).toFixed();

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};


const timePassed = ref(0);
const timerInterval = ref();

const circleDasharray = computed(() => `${(timeFraction.value * FULL_DASH_ARRAY).toFixed(0)} 283`);

const formattedTimeLeft = computed(() => {
  const timeLeft = timeLeft_computed.value as number;
  const minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60 as any;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
});

const timeLeft_computed = computed(() => TIME_LIMIT.value - timePassed.value);

const timeFraction = computed(() => {
  const rawTimeFraction = timeLeft_computed.value / TIME_LIMIT.value;
  return rawTimeFraction - (1 / TIME_LIMIT.value) * (1 - rawTimeFraction);
});

const remainingPathColor = computed(() => {
  const { alert, warning, info } = COLOR_CODES;

  if (timeLeft_computed.value <= alert.threshold) {
    return alert.color;
  } else if (timeLeft_computed.value <= warning.threshold) {
    return warning.color;
  } else {
    return info.color;
  }
});

const toast = useToast()
const emit = defineEmits(['timeOut'])


watch(timeLeft_computed, (newValue) => {
  if (newValue === 0) {
    onTimesUp();
    timeString.value = 'TIME ENDED!'
    toast.add({
      title:`no one answer the question `
    })
    setTimeout(()=>{
    emit('timeOut')
    },2000)
  }
});

onMounted(() => {
  startTimer();
});

const onTimesUp = () => {
  clearInterval(timerInterval.value);
};
const startTimer = () => {
  timerInterval.value = setInterval(() => (timePassed.value += 1), 1000);
};

</script>

<style>
.base-timer {
  position: relative;
  width: 300px;
  height: 300px;
}

.base-timer__svg {
  transform: scaleX(-1);
}

.base-timer__circle {
  fill: none;
  stroke: none;
}

.base-timer__path-elapsed {
  stroke-width: 7px;
  stroke: grey;
}

.base-timer__path-remaining {
  stroke-width: 7px;
  stroke-linecap: round;
  transform: rotate(90deg);
  transform-origin: center;
  transition: 1s linear all;
  fill-rule: nonzero;
  stroke: currentColor;
}

.base-timer__path-remaining.green {
  color: rgb(65, 184, 131);
}

.base-timer__path-remaining.orange {
  color: orange;
}

.base-timer__path-remaining.red {
  color: red;
}

.base-timer__label {
  position: absolute;
  width: 300px;
  height: 300px;
  top: 0;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}
</style>
