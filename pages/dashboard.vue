<script lang="ts" setup>
import { any } from "zod";
import type {
  AnswerExplanationItem,
  FilteredItem,
  OriginalItem,
  answersItem,
} from "~/types";

definePageMeta({
  middleware: ["auth"],
  layout: "default",
});
const useDash = useDashboardStore();
onMounted(() => {
  dataTable();
});
const filteredData = ref<any>([]);

const dataTable = async () => {
  await useDash.getAllQuestions();
  const rawData = useDash.dataTable; // Retrieve the array using .value

  filteredData.value = rawData.map((item: any) => {
    const {
      id,
      Q_imageUrl,
      Q_text,
      correctAnswer,
      answers,
      AnswerExplanation,
    } = item;

    const explanation: AnswerExplanationItem[] = AnswerExplanation.map(
      (explanationItem: AnswerExplanationItem) => ({
        id: explanationItem.id,
        explanationText: explanationItem.explanationText,
        A_imageUrl: explanationItem.A_imageUrl,
      })
    );

    const answersFilter: answersItem[] = answers.map((val: answersItem) => ({
      A_text: val.A_text,
      isCorrect: val.isCorrect,
    }));

    return {
      id,
      Q_imageUrl,
      Q_text,
      correctAnswer,
      answers: answersFilter,
      explanationText:
        explanation.length > 0 ? explanation[0].explanationText : null,
      A_imageUrl: explanation.length > 0 ? explanation[0].A_imageUrl : null,
    };
  });
  console.log(filteredData.value); // Log the filtered data
};

const columns = [
  {
    key: "id",
    label: "ID",
    sortable: true,
  },
  {
    key: "Q_imageUrl",
    label: "Question Image?",
    sortable: true,
  },
  {
    key: "Q_text",
    label: "Question Text?",
    sortable: true,
  },
  {
    key: "correctAnswer",
    label: "Correct Answer?",
    sortable: true,
  },
  {
    key: "answers",
    label: "Answers?",
    sortable: true,
  },
  {
    key: "explanationText",
    label: "Explanation Text?",
    sortable: true,
  },
  {
    key: "A_imageUrl",
    label: "Answer Image?",
    sortable: true,
  },
];

const q = ref("");

const filteredRows = computed(() => {
  if (!q.value) {
    return filteredData.value;
  }

  return filteredData.value.filter((person: any) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});

console.log(filteredRows.value);

const page = ref(1);
const pageCount = 5;

const rows = computed(() => {
  return filteredRows.value.slice(
    (page.value - 1) * pageCount,
    page.value * pageCount
  );
});

// const tempImage = useDash.getImageByName
// const blob = computed(() => URL.createObjectURL(useDash.image));
const blob = ref();
const tempImageUrl = ref();
const tempBlob = ref();
const fetchImage = async (imageUrl: any) => {
  if (tempImageUrl.value !== imageUrl) {
    try {
      await useDash.setImage();
      await useDash.getImageByName(imageUrl);
      tempImageUrl.value = imageUrl;
      tempBlob.value = URL.createObjectURL(useDash.image);
      blob.value = tempBlob.value;
    } catch (error) {
      blob.value = "";
      console.error("Error fetching image:", error);
    }
  } else {
    blob.value = tempBlob.value;
  }
};
</script>

<template>
  <div class="my-4 w-3/4 mx-auto outline outline-offset-4 rounded-md outline-sky-500">
    <InsertDelete />
    <div class="">
      <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
        <UInput v-model="q" placeholder="Filter people..." />
      </div>

      <UTable dir="auto" :columns="columns" :rows="rows">


        <template #answers-data="{ row }">
          <UPopover v-if="row.answers.length > 0" mode="hover"
            :popper="{ placement: 'top-end', arrow: true, offsetDistance: 20 }">
            <UButton color="primary" label="show" />

            <template #panel>
              <div class="p-2">
                <UTextarea dir="auto" autoresize :model-value="JSON.stringify(row.answers, null, 2)" />
              </div>
            </template>
          </UPopover>
          <p v-else>null</p>
        </template>


        <template #Q_imageUrl-data="{ row }">
          <UPopover v-if="row.Q_imageUrl !== null" :popper="{ placement: 'top', offsetDistance: 0 }">
            <UButton @click="fetchImage(row.Q_imageUrl)" color="primary" :label="row.Q_imageUrl" />

            <template #panel>
              <div class="p-2">
                <img v-if="blob" :src="blob" class="max-w-60" :alt="row.Q_imageUrl" />

                <svg v-else xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 300 150">
                  <defs>
                    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color: #3498db; stop-opacity: 1" />
                      <stop offset="100%" style="stop-color: #2c3e50; stop-opacity: 1" />
                    </linearGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#bgGradient)" />
                  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#ecf0f1" text-anchor="middle"
                    alignment-baseline="middle">
                    Not Found
                  </text>
                </svg>
              </div>
            </template>
          </UPopover>
          <p v-else>null</p>
        </template>


        <template #A_imageUrl-data="{ row }">
          <UPopover v-if="row.A_imageUrl !== null" :popper="{ placement: 'auto', offsetDistance: 0 }">
            <UButton @click="fetchImage(row.A_imageUrl)" color="primary" :label="row.A_imageUrl" />

            <template #panel>
              <div class="p-2">
                <img v-if="blob" :src="blob" class="max-h-28" :alt="row.A_imageUrl" />

                <svg v-else xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 300 150">
                  <defs>
                    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color: #3498db; stop-opacity: 1" />
                      <stop offset="100%" style="stop-color: #2c3e50; stop-opacity: 1" />
                    </linearGradient>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#bgGradient)" />
                  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#ecf0f1" text-anchor="middle"
                    alignment-baseline="middle">
                    Not Found
                  </text>
                </svg>
              </div>
            </template>
          </UPopover>
          <p v-else>null</p>
        </template>


        <template #explanationText-data="{ row }">
          <p dir="auto">{{ row.explanationText }}</p>
        </template>

        <template #Q_text-data="{ row }">
          <p v-if="row.Q_text" dir="auto">{{ row.Q_text }}</p>
          <p v-else>null</p>
        </template>

      </UTable>

      <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
        <UPagination v-model="page" :page-count="pageCount" :total="filteredRows.length" />
      </div>
    </div>
  </div>
</template>

<style></style>
