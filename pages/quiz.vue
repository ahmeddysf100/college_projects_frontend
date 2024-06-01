<script lang="ts" setup>
definePageMeta({
  middleware: ["auth-student"],
  layout: "default",
});

onMounted(() => {
  quiz.random = true
  outlineRandom.value = 'text-green-500 dark:text-green-600 font-bold text-xl tracking-wide underline decoration-2 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900 ring-[5px] ring-[#ace5af] selectedBTN';

})


const quiz = reactive({
  random: false,
  subject: false,
  rapid: false,
});

const outlineRandom = ref('');
const outlineSubject = ref('');
const outlineRapid = ref('');

const clicked = (e: any) => {

  quiz.rapid = quiz.subject = quiz.random = false;
  outlineRandom.value = outlineRapid.value = outlineSubject.value = '';
  const text = e.target.innerText;
  console.log(text);
  switch (text) {
    case 'standard':
      quiz.random = true;
      outlineRandom.value = 'text-green-500 dark:text-green-600 font-bold text-xl tracking-wide underline decoration-2 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900 ring-[5px] ring-[#ace5af] selectedBTN';
      break;
    case 'rapid':
      quiz.rapid = true;
      outlineRapid.value =  'text-rose-500   dark:text-rose-600 font-bold text-xl tracking-wide underline decoration-2 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900 ring-[5px] ring-rose-200  selectedBTN';
      break;
    // case 'subject':
    //   quiz.subject = true;
    //   outlineSubject.value = 'text-yellow-500 dark:text-yellow-600 font-bold text-xl tracking-wide underline decoration-2 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900 ring-[5px] ring-yellow-200 selectedBTN';
    //   break;
    default:
      console.log('noo matches for switch');
      break;
  }
};
</script>

<template>
  <div class="mx-auto w-[95%] sm:w-[80%] text-pretty mt-20">
    <UCard class="">
      <UDivider label="Choose Quiz"
        :ui="{ border: { base: 'border_gradient_gray', size: { horizontal: 'border-t-4' } }, label: 'sm:text-3xl text-xl  text-primary-500 dark:text-primary-400 ' }" />

      <div class="grid grid-cols-6 gap-5 text-center mt-10">

        <UButton @click="clicked" :ui="{ rounded: 'borderRadius' }" block :class="outlineRandom"
          class=" animate-moving-gradient mb-4 transition ease-in-out hover:-skew-x-10 hover:-translate-y-4 hover:scale-x-110 duration-300 h-24 rounded-md bg-gradient-to-r from-[#5EB863] via-[#87B85E] to-[#b0e4b4] col-start-2  col-span-4">
          standard
        </UButton>

        <UButton @click="clicked" :ui="{ rounded: 'borderRadius' }" block :class="outlineRapid"
          class=" animate-moving-gradient mb-4 transition ease-in-out hover:-skew-x-10 hover:-translate-y-4 hover:scale-x-110 duration-300 h-24 rounded-md bg-gradient-to-l from-[#5EB863] via-[#87B85E] to-[#b0e4b4] col-start-2  col-span-4">
          rapid
        </UButton>

        <!-- <UButton @click="clicked" :ui="{ rounded: 'borderRadius' }" block :class="outlineSubject"
          class=" animate-moving-gradient transition ease-in-out hover:-skew-x-10 hover:-translate-y-4 hover:scale-x-110 duration-300 h-24 rounded-md bg-gradient-to-r from-[#5EB863] via-[#87B85E] to-[#b0e4b4] col-start-1 col-end-3">
          subject
        </UButton> -->

      </div>
    </UCard>

    <UCard class="mx-auto mt-10">
      <QuizRandom v-if="quiz.random" />
      <QuizRapid v-if="quiz.rapid" />
      <!-- <p>aaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaa
        aaaaaaaaa aaaaaaaaaaa aaaaaaaaaaaaaaa aaaaaaaaaa aaaaaaaaaaaa aaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        aaaaaaaaaaa</p> -->
    </UCard>
  </div>
</template>

<style>
/* styles.css */
.border_gradient_gray {
  border-image: #00c9ff;
  /* fallback for old browsers */
  border-image: -webkit-linear-gradient(to left, #00c9ff, #92fe9d) 1;
  /* Chrome 10-25, Safari 5.1-6 */
  border-image: linear-gradient(to left, #92FE9D, #00C9FF) 1;
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.borderRadius {
  border-radius: 5px 20px 5px;
}

.borderRadius:hover {
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}


.animate-moving-gradient {
  animation: moving-gradient 1.5s linear infinite;
  /* Decrease duration to make it faster */
}

@keyframes moving-gradient {
  0% {
    background-position: 0% 51%;
  }

  50% {
    /* Adjust keyframes to make the movement more noticeable */
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 51%;
  }
}


.selectedBTN {

  background: hsla(145, 83%, 74%, 1);

  background: linear-gradient(0deg, hsla(145, 83%, 74%, 1) 0%, hsla(204, 77%, 76%, 1) 100%);

  background: -moz-linear-gradient(0deg, hsla(145, 83%, 74%, 1) 0%, hsla(204, 77%, 76%, 1) 100%);

  background: -webkit-linear-gradient(0deg, hsla(145, 83%, 74%, 1) 0%, hsla(204, 77%, 76%, 1) 100%);

  filter: progid: DXImageTransform.Microsoft.gradient(startColorstr="#87f4b5", endColorstr="#93cbf1", GradientType=1);
  animation: selectedBTN 5s ease infinite;
  -webkit-animation: selectedBTN 5s ease infinite;

}

@-webkit-keyframes selectedBTN {
  0% {
    background-position: 0% 51%
  }

  50% {
    background-position: 100% 50%
  }

  100% {
    background-position: 0% 51%
  }
}

@-moz-keyframes selectedBTN {
  0% {
    background-position: 0% 51%
  }

  50% {
    background-position: 100% 50%
  }

  100% {
    background-position: 0% 51%
  }
}

@-o-keyframes selectedBTN {
  0% {
    background-position: 0% 51%
  }

  50% {
    background-position: 100% 50%
  }

  100% {
    background-position: 0% 51%
  }
}

@keyframes selectedBTN {
  0% {
    background-position: 0% 51%
  }

  50% {
    background-position: 100% 50%
  }

  100% {
    background-position: 0% 51%
  }
}
</style>
