<script lang="ts" setup>
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

const getRandom = async () => {
  randomData.difficulty = selected.value.id
  // console.log(randomData)
  await useQuiz.getRandomQuestions(randomData)


  const data: any = computed(() => useQuiz.questions)
  const rawData = await JSON.parse(data.value)
  Q.value = rawData
  if (rawData) {
    console.log(rawData)
    setQuiz(rawData)
  }
  if (rawData[0].correctAnswer) {
    console.log('aaaaaaaaaaaaaa')
  }



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

  console.table(blob.value)
}
const arrayQuestions = ref([])

const setQuiz = (data: any) => {
  arrayQuestions.value = []
  console.log(data.length)
  for (let i = 0; i < data.length; i++) {
    const question = { correctAnswer: '', answers: [], }

    if (data[i].correctAnswer) {
      question.correctAnswer = data[i].correctAnswer;
    } else {
      question.answers = data[i].answers;
    }

    if (data[i].Q_text) {

    }

    // console.log(question)
    arrayQuestions.value.push(question)
  }
  console.table(arrayQuestions.value)
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

      <UButton @click="getRandom" class="sm:w-96 w-52 text-2xl" label="start" size="xl" block />
    </div>
    <div>
      <!-- <QuizQuestion/> -->

      <div v-for="(item, index) in Q" :key="item.id">
        <div v-if="item.Q_imageUrl">
          <img :src="blob[index]" :alt="item.Q_text">
        </div>
      </div>

    </div>
  </div>
</template>




<style></style>