<script lang="ts" setup>



const useQuiz = useMyQuizStore()
const useDash = useDashboardStore()

const selectList_difficulty = [
  {
    label: 'Normal',
    id: '1'
  },
  {
    label: 'Hard',
    id: '2'
  },
  {
    label: 'Very hard',
    id: '3'
  },
]
const selectList_time = [
  {
    label: '20 minutes',
    id: 1200
  },
  {
    label: '10 minutes',
    id: 600
  },
  {
    label: '5 minutes',
    id: 300
  },
]
const selectList_num = [
  {
    label: '10',
    id: '10'
  },
  {
    label: '20',
    id: '20'
  },
  {
    label: '30',
    id: '30'
  },
  {
    label: '40',
    id: '40'
  },
  {
    label: '50',
    id: '50'
  },
]
const selectList_Subject = [
  {
    label: 'random',
    id: 'random'
  },
  {
    label: 'ashkal',
    id: 'ashkal'
  },
  {
    label: 'lost numbers',
    id: 'lost numbers'
  },
  {
    label: 'verbal',
    id: 'verbal'
  },
  {
    label: 'Sequences',
    id: 'Sequences'
  },
  {
    label: 'Arithmetic and logical operations',
    id: 'Arithmetic and logical operations'
  },
]
const selected_difficulty = ref(selectList_difficulty[0])
const selected_num = ref(selectList_num[0])
const selected_Subject = ref(selectList_Subject[0])
const selected_time = ref(selectList_time[0])



const blob = ref<any>([]);
const openForm = ref(false)
const userAnswer = ref<any[]>([])
const rawData = ref()

const startQuiz = async () => {
  useQuiz.setTime(selected_time.value.id)

  const randomData = {
  count: selected_num.value.id,
  difficulty: selected_difficulty.value.id,
  subject: selected_Subject.value.id,
}
  console.log(randomData)
  await useQuiz.getRandomQuestions(randomData)


  const data: any = computed(() => useQuiz.questions)
  rawData.value = await JSON.parse(data.value)

  if (rawData) {
    openResult.value = false
    openForm.value = true;
    console.log(rawData.value)
    getRawAnswers(rawData.value)
    //show timer when data receved
    useQuiz.showTimer = true;
    //start timer after some time waiting for question componont to mount
    useQuiz.startTimer = true;
    useQuiz.timerPosition = 'nav'
  }









  // gggggggggggggggggggggggggggggggget image
  const tempBlob = ref();
  // reset blob array in evry new req 
  blob.value = []
  for (let i = 0; i < rawData.value.length; i++) {
    if (rawData.value[i].Q_imageUrl) {

      useDash.setImage();
      await useDash.getImageByName(rawData.value[i].Q_imageUrl);
      tempBlob.value = URL.createObjectURL(useDash.image as any);
      blob.value.push(tempBlob.value);
    } else {
      blob.value.push(null);
    }
  }

  // console.table(blob.value)
}


const rawAnswers1 = ref<any[]>([])
const rawAnswers2 = ref<any[]>([])

const getRawAnswers = (data: any[]) => {
  rawAnswers1.value = []
  console.log('inn rawwwwwwwwww 82')
  data.forEach((i, index1) => {

    if (i.correctAnswer) {

      rawAnswers1.value.push(i.correctAnswer.trim().toLowerCase())

    }
    else if (i.answers) {

      i.answers.forEach((j: any, index2: any) => {

        // console.log(j.A_text)
        if (j.isCorrect === true) {

          rawAnswers1.value.push(j.A_text.trim().toLowerCase())

          rawAnswers2.value.push({ A_text: j.A_text.trim().toLowerCase(), isCorrect: j.isCorrect })

        }
      })

    }
  });
  // rawAnswers1.value = rawAnswers1.value.map(answer => answer.trim().toLowerCase());
  console.table(rawAnswers1.value)
  console.table(rawAnswers2.value)

}


const wrongAnswers = ref<any>([])
const trueCount = ref(0)
const falseCount = ref(0)
const emptyQuestion = ref()
const handleSubmit = async () => {
  // if user submit timer component unmount or time out wil unmount (see question component)
  useQuiz.showTimer = false
  userAnswer.value = userAnswer.value.map(user => user.trim().toLowerCase());
  wrongAnswers.value = []
  trueCount.value = 0
  falseCount.value = 0
  emptyQuestion.value = 0
  if (userAnswer.value.length > 0) {
    console.log('vvvvvvvvvvvv')
    userAnswer.value.forEach((user, index) => {

      console.log({ user_answers: user, write_answers: rawAnswers1.value[index] })
      // trim start and end spaces of userAnswers
      if (user === rawAnswers1.value[index]) {
        wrongAnswers.value.push()
        trueCount.value++
      } else if (user === null) {
        falseCount.value++
        emptyQuestion.value++
      }
      else {
        wrongAnswers.value.push({ userWrongAnswer: user, index: index })
        falseCount.value++
      }


    })
    emptyQuestion.value = rawAnswers1.value.length - (falseCount.value + trueCount.value)
  } else {
    emptyQuestion.value = rawAnswers1.value.length
    falseCount.value = rawAnswers1.value.length
    console.log(emptyQuestion.value)
  }

  console.table(wrongAnswers.value)
  openForm.value = false
  messageSlecter()
  openResult.value = true
  userAnswer.value = []
}



//if time out and the still did not submit => system submit auto
const startSubmit = computed(() => useQuiz.startSubmit)
// const shouldAnswer = ref(true)
watch(startSubmit, (newValue, oldValue) => {
  console.log('submitttttttt', newValue)
  if (newValue === true) {
    handleSubmit()
  }
})




const resultMessage = ref()
const messageSlecter = async () => {
  console.log(falseCount.value)
  // console.log(Math.floor(rawAnswers1.value.length / 2))

  if (falseCount.value === 0) { resultMessage.value = 'Congratulations, you have answered all the questions correctly' }
  else if (falseCount.value <= Math.floor(rawAnswers1.value.length / 2)) { resultMessage.value = 'Great, you succeeded, try to improve yourself more' }
  else { resultMessage.value = 'Come on broo do better' }
  // stop loading in btn start
  rawData.value = null
}
const openResult = ref(false)

const isSelected = (index: any, index2: any, item: any) => {
  return userAnswer.value[index] === item.answers[index2].A_text;
}




onUnmounted(() => {
  // unmount/reset timer when user change quiz mode 
  useQuiz.showTimer = false
})
</script>


<template>
  <div>
    <div>
      <h1 class=" tracking-wide font-bold text-xl text-green-500">Random :</h1>
      <p class="tracking-wide my-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi exercitationem
        dignissimos ducimus, blanditiis id, iure accusantium rem laboriosam debitis repudiandae, ea a mollitia quaerat
        eaque at molestiae consectetur unde reiciendis.</p>
    </div>
    <div class=" grid grid-cols-2 justify-items-center my-8">
      <UFormGroup class="sm:w-60 w-auto mb-6" label="Difficulty" help="choose the difficulty of questions" required>
        <USelectMenu size="xl" v-model="selected_difficulty" :options="selectList_difficulty" />
      </UFormGroup>

      <UFormGroup class="sm:w-60 w-auto  mb-6" label="Number 0f questions" help="choose woh many questions you need"
        required>
        <USelectMenu size="xl" v-model="selected_num" :options="selectList_num" />
      </UFormGroup>

      <UFormGroup class="sm:w-60 w-auto mb-6" label="Subject" help="choose the subject of questions" required>
        <USelectMenu size="xl" v-model="selected_Subject" :options="selectList_Subject" />
      </UFormGroup>

      <UFormGroup class="sm:w-60 w-auto mb-6" label="Time" help="choose the total time for all questions" required>
        <USelectMenu size="xl" v-model="selected_time" :options="selectList_time" />
      </UFormGroup>

    </div>
    <UButton @click="startQuiz" class="sm:w-96 w-52 text-2xl mx-auto" label="start" size="xl" block
      :loading="rawData ? true : false" />


    <!-- <QuizQuestion/> -->
    <div v-if="openForm">
      <UForm @submit="handleSubmit">
        <div v-for="(item, index) in rawData" :key="item.id" v-motion
          :initial="{ opacity: 0, x: index % 2 === 0 ? 100 : -100 }"
          :visible-once="{ opacity: 1, x: 0, transition: { duration: 250 } }">



          <div v-if="item.correctAnswer" class=" border-4 grid justify-center my-16 py-6">
            <h1>{{ index }}</h1>
            <img v-if="item.Q_imageUrl" :src="blob[index]" :alt="`img ${item.Q_imageUrl} index in array ${index}`">
            <h1 v-else="item.Q_text" class=" font-bold text-xl tracking-wide">{{ item.Q_text }}</h1>

            <UFormGroup label="Enter answer" class="mt-4" required>
              <UInput v-model="userAnswer[index]" color="primary" variant="outline" placeholder="Your answer..." />
            </UFormGroup>

          </div>


          <div v-else="item.answers" class=" border-4 grid justify-center my-16 p-6">
            <h1>{{ index }}</h1>
            <img v-if="item.Q_imageUrl" :src="blob[index]" :alt="`img ${item.Q_imageUrl} index in array ${index}`">
            <h1 v-else="item.Q_text" class=" font-bold text-xl tracking-wide">{{ item.Q_text }}</h1>

            <div v-for="(i, index2) in item.answers" :key="i.id"
              :class="['flex', 'justify-start', 'gap-4', 'rounded-full', 'm-4', 'hover:bg-gradient-to-r hover:from-[#86f4b4] hover:to-[#93cbf1] ',
                isSelected(index, index2, item) ? '  bg-gradient-to-r from-[#86f4b4] to-[#93cbf1]' : 'outline outline-offset-2 outline-stone-400']">
              <input :id="`Q${index} option${index2}`" type="radio" :name="`Q${index}`" :value="i.A_text"
                v-model="userAnswer[index]" class="w-8 h-8 custom-radio cursor-pointer" required />
              <label :for="`Q${index} option${index2}`" class="self-center w-full py-2 text-center cursor-pointer "
                :class="isSelected(index, index2, item) ? 'text-black' : ''">{{
                  i.A_text }}</label>
            </div>


          </div>
        </div>


        <div>
          <UButton class="text-xl" size="xl" type="submit" label="Submit" block />
        </div>
      </UForm>
    </div>
    <div v-if="openResult" class=" grid justify-center my-20">
      <h1
        class="text-2xl font-bold bg-gradient-to-r from-orange-700 via-blue-500 to-green-400 text-transparent bg-clip-text  animate-gradient">
        {{ resultMessage }}</h1>
      <p class=" text-xl font-semibold">your score {{ trueCount }}/{{ rawAnswers1.length }}</p>
      <p v-if="emptyQuestion">questions did not answer: {{ emptyQuestion }}</p>
    </div>
  </div>
</template>




<style>
.custom-radio {
  /* Hide the default radio button */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  /* Create a custom radio button appearance */
  /* width: 20px; */
  /* height: 20px; */
  border-radius: 50%;
  /* border: 2px solid #554747; */
  background-color: #595e5868;
  /* Change background color */
  /* outline: none; */
  cursor: pointer;
  margin: 5px;
  display: none;
}



.border_gradient_gray {
  border-image: #00c9ff;
  /* fallback for old browsers */
  border-image: -webkit-linear-gradient(to left, #00c9ff, #92fe9d) 1;
  /* Chrome 10-25, Safari 5.1-6 */
  border-image: linear-gradient(to left, #92FE9D, #00C9FF) 1;
  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>