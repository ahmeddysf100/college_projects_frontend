<script lang="ts" setup>
import { forEachTrailingCommentRange } from 'typescript';
import { any } from 'zod';


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


const Q = ref()
const blob = ref([]);
const openForm = ref(false)
const userAnswer = ref([])

const startQuiz = async () => {
  randomData.difficulty = selected.value.id
  // console.log(randomData)
  await useQuiz.getRandomQuestions(randomData)


  const data: any = computed(() => useQuiz.questions)
  const rawData = await JSON.parse(data.value)
  Q.value = rawData

  if (rawData) {
    openForm.value = true;
    console.log(rawData)
    getRawAnswers(rawData)
  }









  // gggggggggggggggggggggggggggggggget image
  const tempImageUrl = ref();
  const tempBlob = ref();
  // reset blob array in evry new req 
  blob.value = []
  for (let i = 0; i < Q.value.length; i++) {
    if (Q.value[i].Q_imageUrl) {

      await useDash.setImage();
      await useDash.getImageByName(Q.value[i].Q_imageUrl);
      tempBlob.value = URL.createObjectURL(useDash.image);
      blob.value.push(tempBlob.value);
    } else {
      blob.value.push(null);
    }
  }

  // console.table(blob.value)
}


const rawAnswers = ref([])
const getRawAnswers = (data: any[]) => {
  console.log('inn rawwwwwwwwww 82')
  data.forEach((i, index) => {
    if (i.correctAnswer) {
      rawAnswers.value.push(i.correctAnswer)
    }
    else if (i.answers) {
      rawAnswers.value.push(i.answers)
    }
  });
  console.table(rawAnswers.value)
}




const wrongAnswers = ref([])
const handleSubmit = async () => {
  // console.table(userAnswer.value)
  wrongAnswers.value = []
  
  userAnswer.value.forEach((user, index) => {
    console.log({ user_answers: user, write_answers: rawAnswers.value[index] })

    user === rawAnswers.value[index] ? wrongAnswers.value.push(null) :
     wrongAnswers.value.push({ userWrongAnswer: user, index: index })
  })

  console.table(wrongAnswers.value)
  // openForm.value = false
  userAnswer.value = []
  rawAnswers.value = []
}



</script>


<template>
  <div>
    <div>
      <h1 class=" tracking-wide font-bold text-xl text-green-500">Random :</h1>
      <p class="tracking-wide my-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi exercitationem
        dignissimos ducimus, blanditiis id, iure accusantium rem laboriosam debitis repudiandae, ea a mollitia quaerat
        eaque at molestiae consectetur unde reiciendis.</p>
    </div>
    <div class=" grid justify-items-center my-8">
      <UFormGroup class="sm:w-96 w-52  mb-6" label="Difficulty" help="choose the difficulty of quistions" required>
        <USelectMenu size="xl" v-model="selected" :options="selectList" />
      </UFormGroup>

      <UButton @click="startQuiz" class="sm:w-96 w-52 text-2xl" label="start" size="xl" block />
    </div>
    <div>
      <!-- <QuizQuestion/> -->
      <form v-if="openForm">

        <div v-for="(item, index) in Q" :key="item.id">
          <div v-if="item.correctAnswer" class=" border-4 grid justify-center my-16 py-6">
            <h1>{{ index }}</h1>
            <img v-if="item.Q_imageUrl" :src="blob[index]" :alt="`img ${item.Q_imageUrl} index in array ${index}`">
            <h1 v-else="item.Q_text" class=" font-bold text-xl tracking-wide">{{ item.Q_text }}</h1>

            <UFormGroup label="Enter answer" class="mt-4" required>
              <UInput v-model="userAnswer[index]" color="primary" variant="outline" placeholder="Your answer..." />
            </UFormGroup>

          </div>


          <div v-else="item.answers" class=" border-4 grid justify-center my-16">

            <img v-if="item.Q_imageUrl" :src="blob[index]" :alt="`img ${item.Q_imageUrl} index in array ${index}`">
            <h1 v-else="item.Q_text" class=" font-bold text-xl tracking-wide">{{ item.Q_text }}</h1>

          </div>
        </div>


        <div>
          <UButton class="text-xl" size="xl" @click="handleSubmit" label="Submit" block />
        </div>
      </form>

    </div>
  </div>
</template>




<style></style>