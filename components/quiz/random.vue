<script lang="ts" setup>



const useQuiz = useMyQuizStore()
const useDash = useDashboardStore()

const selectList = [
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
const selected = ref(selectList[0])
const randomData = reactive({
  count: '20',
  difficulty: '',
})


const blob = ref([]);
const openForm = ref(false)
const userAnswer = ref<any[]>([])
const rawData = ref()

const startQuiz = async () => {
  randomData.difficulty = selected.value.id
  // console.log(randomData)
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
  }









  // gggggggggggggggggggggggggggggggget image
  const tempBlob = ref<string | null>(null);
  // reset blob array in evry new req 
  blob.value = []
  for (let i = 0; i < rawData.value.length; i++) {
    if (rawData.value[i].Q_imageUrl) {

      useDash.setImage();
      await useDash.getImageByName(rawData.value[i].Q_imageUrl);
      tempBlob.value = URL.createObjectURL(useDash.image);
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



const wrongAnswers = ref([])
const falseCount = ref(0)
const emptyQuestion = ref()
const handleSubmit = async () => {
  // if user submit timer component unmount or time out wil unmount (see question component)
  useQuiz.showTimer = false
  userAnswer.value = userAnswer.value.map(user => user.trim().toLowerCase());
  wrongAnswers.value = []
  falseCount.value = 0
  emptyQuestion.value = 0
  if (userAnswer.value.length > 0) {
    console.log('vvvvvvvvvvvv')
    userAnswer.value.forEach((user, index) => {

      console.log({ user_answers: user, write_answers: rawAnswers1.value[index] })
      // trim start and end spaces of userAnswers
      if (user === rawAnswers1.value[index]) {
        wrongAnswers.value.push(null)

      } else if (user === null) {
        falseCount.value++
        emptyQuestion.value++
      }
      else {
        wrongAnswers.value.push({ userWrongAnswer: user, index: index })
        falseCount.value++
      }


    })
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





</script>


<template >
  <div>
    <div>
      <h1 class=" tracking-wide font-bold text-xl text-green-500">Random :</h1>
      <p class="tracking-wide my-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi exercitationem
        dignissimos ducimus, blanditiis id, iure accusantium rem laboriosam debitis repudiandae, ea a mollitia quaerat
        eaque at molestiae consectetur unde reiciendis.</p>
    </div>
    <div class=" grid justify-items-center my-8">
      <UFormGroup class="sm:w-96 w-52  mb-6" label="Difficulty" help="choose the difficulty of questions" required>
        <USelectMenu size="xl" v-model="selected" :options="selectList" />
      </UFormGroup>

      <UButton @click="startQuiz" class="sm:w-96 w-52 text-2xl" label="start" size="xl" block :loading="rawData" />
    </div>
    <div>



      <!-- <QuizQuestion/> -->
      <div v-if="openForm">
        <UForm @submit="handleSubmit">
          <div v-for="(item, index) in rawData" :key="item.id" v-motion
            :initial="{ opacity: 0, x: index % 2 === 0 ? 100 : -100 }"
            :visible="{ opacity: 1, x: 0, transition: { duration: 250 } }">



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
                :class="['flex', 'justify-start', 'gap-4', 'rounded-full', 'my-4',
                  isSelected(index, index2, item) ? 'outline outline-offset-2 outline-green-500 bg-green-400' : 'outline outline-offset-2 outline-stone-400']">
                <input :id="`Q${index} option${index2}`" type="radio" :name="`Q${index}`" :value="i.A_text"
                  v-model="userAnswer[index]" class="w-8 h-8 custom-radio" required />
                <label :for="`Q${index} option${index2}`" class="self-center w-full py-2 text-center">{{ i.A_text }}</label>
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
        <p class=" text-xl font-semibold">your score {{ rawAnswers1.length - falseCount }}/{{ rawAnswers1.length }}</p>
        <p v-if="emptyQuestion">questions did not answer: {{ emptyQuestion }}</p>
      </div>
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

/* Style the radio button when it's checked */
.custom-radio:checked {
  background-color: #108e3000;
  /* Change background color when checked */
}


.animate-gradient {
  background-size: 300%;
  -webkit-animation: animatedgradient 6s ease infinite alternate;
  -moz-animation: animatedgradient 6s ease infinite alternate;
  animation: animatedgradient 6s ease infinite alternate;
}

@keyframes animatedgradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>