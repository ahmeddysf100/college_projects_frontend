<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Question } from '~/types';
export interface blobArray {
  Q_imageUrl: string;
  blob: Blob;
}

const useDash = useDashboardStore();
// do not change ([]) to ()
const userAnswer = ref<any[]>([]);
const rawData = ref<Question[]>();
const selectedQuestions = computed(() => useDash.selectedQuestions);
const imagesUrl = ref<string[]>([])
const blobArray = ref<blobArray[]>([])

watch(useDash.selectedQuestions, (newVal, oldVal) => {
  rawData.value = newVal;
  console.log('arena ...', rawData.value);
  // console.log(rawData.value)
  if (newVal.length >= oldVal.length) {
    rawData.value.map(async (r: Question) => {
      if (r.Q_imageUrl && !imagesUrl.value.includes(r.Q_imageUrl)) {
        imagesUrl.value.push(r.Q_imageUrl)
        await getImage(r.Q_imageUrl)
      }
    })
  }
  // console.log(imagesUrl.value)
});

const temp = ref()
const getImage = async (url: string) => {
  await useDash.setImage();
  await useDash.getImageByName(url);
  blobArray.value.push({ Q_imageUrl: url, blob: useDash.image as any })
  // console.log(blobArray.value)
}

 function getBlobUrl(url: string): string {
  const blob = blobArray.value.find(item => item.Q_imageUrl === url)?.blob;
  if (blob) {
    return URL.createObjectURL(blob);
  } else {
    
    return ''
  }}

  const isSelected = (index: any, index2: any, item: any) => {
    return userAnswer.value[index] === item.answers[index2].A_text;
  }
</script>

<template>
  <div v-for="(item, index) in rawData" :key="item.id" v-motion
    :initial="{ opacity: 0, x: index % 2 === 0 ? 100 : -100 }"
    :visible-once="{ opacity: 1, x: 0, transition: { duration: 250 } }">



    <div v-if="item.correctAnswer" class=" border-4 grid justify-center my-16 py-6">
      <h1>{{ index }}</h1>
      <img v-if="item.Q_imageUrl && blobArray" :src="getBlobUrl(item.Q_imageUrl)"
        :alt="`img ${item.Q_imageUrl} index in array ${index}`">
      <h1 v-else="item.Q_text" class=" font-bold text-xl tracking-wide">{{ item.Q_text }}</h1>

      <UFormGroup label="Enter answer" class="mt-4" required>
        <UInput v-model="userAnswer[index]" color="primary" variant="outline" placeholder="Your answer..." />
      </UFormGroup>

    </div>


    <div v-else="item.answers" class=" border-4 grid justify-center my-16 p-6">
      <h1>{{ index }}</h1>
      <img v-if="item.Q_imageUrl" :src="getBlobUrl(item.Q_imageUrl)"
        :alt="`img ${item.Q_imageUrl} index in array ${index}`">
      <h1 v-else="item.Q_text" class=" font-bold text-xl tracking-wide">{{ item.Q_text }}</h1>

      <div v-for="(i, index2) in item.answers" :key="i.A_text"
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
</template>

<style>
.custom-radio {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border-radius: 50%;
  background-color: #595e5868;
  cursor: pointer;
  margin: 5px;
  display: none;
}

.border_gradient_gray {
  border-image: #00c9ff;
  border-image: -webkit-linear-gradient(to left, #00c9ff, #92fe9d) 1;
  border-image: linear-gradient(to left, #92FE9D, #00C9FF) 1;
}
</style>
