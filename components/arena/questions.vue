<script lang="ts" setup>
import type { Arena_updated_gear } from '~/createArena';


const useDash = useDashboardStore()
const useArena = useArenaStore()
// const item = ref({
//   "id": 55,
//   "Q_imageUrl": "q-ashkal (2).jpg",
//   "Q_text": null,
//   "correctAnswer": null,
//   "subjectId": 1,
//   "createdAt": "2024-02-09T14:34:11.514Z",
//   "updatedAt": "2024-02-09T14:34:11.514Z",
//   "quizId": 2,
//   "answers": null,
//   "AnswerExplanation": null,
//   "type": "single"
// })

// const item = ref({
//   "id": 66,
//   "Q_imageUrl": null,
//   "Q_text": "عمر فهد الان هو ضعف عمر فيصل , ولكن قبل ست سنوات كان عمر فهد اربع اضعاف عمر فيصل . فكم عمر فهد الان ؟",
//   "correctAnswer": null,
//   "subjectId": 5,
//   "createdAt": "2024-02-15T15:00:54.418Z",
//   "updatedAt": "2024-02-15T15:00:54.418Z",
//   "quizId": 3,
//   "answers": [
//     {
//       "A_text": "24"
//     },
//     {
//       "A_text": "16"
//     },
//     {
//       "A_text": "10"
//     },
//     {
//       "A_text": "18"
//     }
//   ],
//   "AnswerExplanation": null,
//   "type": "multiple"
// })

const emit = defineEmits(['nominate'])

const submit = () => {
  const data = {
    Q_id: item.value.id,
    text: userAnswer.value?.toLocaleLowerCase()
  }
  console.log('emit/question', data)
  // nominate(data)
  emit('nominate', data)
}


export interface blobArray {
  Q_imageUrl: string;
  blob: Blob;
}
const userAnswer = ref<string | undefined>();
const blobArray = ref<blobArray[]>([]);

const getImage = async (url: string) => {
  try {
    await useDash.setImage();
    await useDash.getImageByName(url);
    blobArray.value.push({ Q_imageUrl: url, blob: useDash.image as any });
  } catch (error) {
    console.log('getImage', error);
  }
};

function getBlobUrl(url: string): string {
  const blob = blobArray.value.find(item => item.Q_imageUrl === url)?.blob;
  return blob ? URL.createObjectURL(blob) : '';
}

const isSelected = (index2: any, item: any) => {
  return userAnswer.value === item.answers[index2].A_text;
}
const item = computed(() => useArena.arena_updated_gear as Arena_updated_gear)

watch(item, async (newValue) => {
  if (newValue?.Q_imageUrl) {
    await getImage(newValue.Q_imageUrl);
  }
});

onMounted(async () => {
  if (item.value?.Q_imageUrl) {
    await getImage(item.value.Q_imageUrl);
  }
  const targetElement = document.getElementById('scrolltarget');
  if (targetElement) {
    console.log('aaaaa',targetElement)
    await nextTick()
    const scrollPosition = targetElement.offsetTop - 83;
    window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
  }
})

</script>

<template>
  <div :initial="{ opacity: 0, y: 100 }" :visible-once="{ opacity: 1, y: 0, transition: { duration: 250 } }">


    <div v-if="item.type === 'single'" class="flex flex-col ">
      <h1>q</h1>
      <img v-if="item.Q_imageUrl && blobArray" id="scrolltarget" class=" h-[550px] rounded-lg"
        :src="getBlobUrl(item.Q_imageUrl)" :alt="`img ${item.Q_imageUrl} index in array q`">
      <h1 v-else="item.Q_text" id="scrolltarget" class="font-bold text-xl tracking-wide">{{ item.Q_text }}</h1>

      <UFormGroup label="Enter answer" class="mt-4" required>
        <UInput v-model="userAnswer" color="primary" variant="outline" placeholder="Your answer..." />
      </UFormGroup>
    </div>

    <div v-if="item.type === 'multiple'">
      <h1>q</h1>
      <img v-if="item.Q_imageUrl && blobArray" id="scrolltarget" :src="getBlobUrl(item.Q_imageUrl)" :alt="`img ${item.Q_imageUrl} index in array q`">
      <h1 v-else="item.Q_text" id="scrolltarget" class=" font-bold text-xl tracking-wide">{{ item.Q_text }}</h1>

      <div v-for="(i, index2) in item.answers" :key="i.A_text"
        :class="['flex', 'justify-start', 'gap-4', 'rounded-full', 'm-4', 'hover:bg-gradient-to-r hover:from-[#86f4b4] hover:to-[#93cbf1] ',
          isSelected(index2, item) ? '  bg-gradient-to-r from-[#86f4b4] to-[#93cbf1]' : 'outline outline-offset-2 outline-stone-400']">
        <input :id="`Q$ option${index2}`" type="radio" :name="`Q$`" :value="i.A_text" v-model="userAnswer"
          class="w-8 h-8 custom-radio cursor-pointer" required />
        <label :for="`Q$ option${index2}`" class="self-center w-full py-2 text-center cursor-pointer "
          :class="isSelected(index2, item) ? 'text-black' : ''">{{
            i.A_text }}</label>
      </div>
    </div>
  </div>
  <div class="grid">
    <UButton @click="submit" class=" w-80 mx-auto text-2xl font-bold  " label="start" size="xl" block />
  </div>
</template>

<style>
/* Add your styles here */
</style>