<script lang="ts" setup>
import type {
  AnswerExplanationItem,
  FilteredItem,
  OriginalItem,
  Question,
  answersItem,
} from "~/types";



const props = defineProps(['showInsert'])
const showInsert = props.showInsert


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

const refreshTable = async () => {
  await dataTable()
  console.log('Refreshing table...');
}

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
const selectedColumns = ref(columns)
const columnsTable = computed(() => columns.filter((column) => selectedColumns.value.includes(column)))

const search = ref("");

const filteredRows = computed(() => {
  if (!search.value) {
    return filteredData.value;
  }

  return filteredData.value.filter((person: any) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(search.value.toLowerCase());
    });
  });
});

const resetSearch = () => {
  search.value = ''
}

// console.log(filteredRows.value);

const page = ref(1);
const pageCount = ref(5);
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
const pageTo = computed(() => Math.min(page.value * pageCount.value, filteredRows.value.length))

const rows = computed<Question[]>(() => {
  return filteredRows.value.slice(
    (page.value - 1) * pageCount.value,
    page.value * pageCount.value
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
      tempBlob.value = URL.createObjectURL(useDash.image as any);
      blob.value = tempBlob.value;
    } catch (error) {
      blob.value = "";
      console.error("Error fetching image:", error);
    }
  } else {
    blob.value = tempBlob.value;
  }
};

function select(row: any) {
  const index = selected.value.findIndex((item: any) => item.id === row.id);
  if (index === -1) {
    selected.value.push(row);
    useDash.addSelectedQuestion(row);
  } else {
    selected.value.splice(index, 1);
    useDash.removeSelectedQuestion(index);
  }
  // console.log(selected.value)
  selected.value = [...selected.value]
}

const selected = ref<Question[]>([]);

// Watch for changes in the selected array
watch(selected, (newSelected, oldSelected) => {
  // console.log(selected.value)
  // const added = newSelected.filter(item => !oldSelected.includes(item));
  // const removed = oldSelected.filter(item => !newSelected.includes(item));

  // when user click reset btn of selected col  this if reset selected col in reviewquestions component becuase select func do not work with reset btn
  if (selected.value.length === 0) {
    useDash.selectedQuestions.length = 0
  }
});


const showRightChoose = (row: any[]) => {
  const correctAnswers = row.filter((r: any) => r.isCorrect === true).map((r: any) => `${r.A_text} is correct show more...`);
  return correctAnswers.join(','); // Join correct answers into a single string
}

const windowWidth = ref();
onMounted(() => {
  if (process.client) {
    windowWidth.value = window.innerWidth;
    // console.log(windowWidth);
  } else {
    console.log(
      "Code is running on the server side or in a context where window is not available."
    );
  }
})
</script>

<template>
    <div class=" my-4 w-[95%] sm:w-[80%] mx-auto outline outline-offset-4 rounded-md outline-sky-500">
      <!-- in arena page do not show -->
      <InsertDelete v-if="showInsert" :refreshTable="refreshTable" />


      <UCard class="w-full mt-20" :ui="{
        base: '',
        ring: '',
        divide: 'divide-y divide-gray-200 dark:divide-gray-700',
        header: { padding: 'px-4 py-5' },
        body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
        footer: { padding: 'p-4' }
      }">
        <template #header>
          <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
            DataBase table
          </h2>
        </template>
        <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
          <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search..." />
        </div>


        <!-- Header and Action buttons -->
        <div class="flex justify-between items-center flex-wrap w-full px-4 py-3">
          <div class="flex items-center gap-1.5 mb-4">
            <span class="text-sm leading-5">Rows per page:</span>

            <USelect v-model="pageCount" :options="[3, 5, 10, 20, 30, 40]" class="me-2 w-20" size="xs" />
          </div>
          <div class="flex gap-1.5 items-center ">
            <USelectMenu v-model="selectedColumns" :options="columns" multiple>
              <UButton icon="i-heroicons-view-columns" color="gray" size="xs">
                Columns
              </UButton>
            </USelectMenu>

            <UButton icon="i-heroicons-funnel" color="gray" size="xs" :disabled="search === ''" @click="resetSearch">
              Reset
            </UButton>
          </div>
        </div>



        <UTable dir="auto" v-model="selected" @select="select" :columns="columnsTable" :rows="rows">


          <template #answers-data="{ row }">
            <UPopover v-if="row.answers.length > 0" :mode="windowWidth <= 425 ? 'click' : 'hover'"
              :popper="{ placement: 'top-end', arrow: true, offsetDistance: 20 }">
              <UButton color="primary" :label="showRightChoose(row.answers)" />

              <template #panel>
                <div class="p-2 divide-y">
                  <p v-for="(answer, index) in row.answers" :id="answer.A_text" class=" tracking-wide break-words"
                    :class="windowWidth <= 425 ? ' text-[10px]' : 'text-base'">
                    {{ index + 1 }}. <span class="dark:text-slate-200 text-slate-800">{{ answer.A_text }}</span> /
                    <span :class="answer.isCorrect === true ? 'text-green-500' : 'text-red-500'">{{ answer.isCorrect
                      }}</span>
                  </p>
                </div>
              </template>
            </UPopover>
            <p v-else>null</p>
          </template>


          <template #Q_imageUrl-data="{ row }">
            <UPopover v-if="row.Q_imageUrl !== null" :mode="windowWidth <= 425 ? 'click' : 'hover'"
              :popper="{ placement: 'top', offsetDistance: 0 }">
              <UButton @mouseover="fetchImage(row.Q_imageUrl)" color="primary" :label="row.Q_imageUrl" />

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
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#ecf0f1"
                      text-anchor="middle" alignment-baseline="middle">
                      Not Found
                    </text>
                  </svg>
                </div>
              </template>
            </UPopover>
            <p v-else>null</p>
          </template>


          <template #A_imageUrl-data="{ row }">
            <UPopover v-if="row.A_imageUrl !== null" :mode="windowWidth <= 425 ? 'click' : 'hover'"
              :popper="{ placement: 'auto', offsetDistance: 0 }">
              <UButton @mouseover="fetchImage(row.A_imageUrl)" color="primary" :label="row.A_imageUrl" />

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
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#ecf0f1"
                      text-anchor="middle" alignment-baseline="middle">
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
            <UPopover v-if="row.Q_text" :mode="windowWidth <= 425 ? 'click' : 'hover'"
            :popper="{ placement: 'top-end', arrow: true, offsetDistance: 0 }">
              <UButton dir="auto" color="primary" label="show" />
              <template #panel>
                <div class="p-2">
                  <UTextarea v-if="windowWidth <= 425" textarea-class="dark:text-slate-200 text-slate-800"
                    :ui="{ base: row.Q_text.length > 50 ? 'w-[200px]' : '' }" dir="auto" size="xl" :rows="1" padded
                    autoresize variant="none" :model-value="row.Q_text" />
                  <UTextarea v-else textarea-class="dark:text-slate-200 text-slate-800"
                    :ui="{ base: row.Q_text.length > 50 ? 'w-[400px]' : '' }" dir="auto" size="xl" :rows="1" padded
                    autoresize variant="none" :model-value="row.Q_text" />
                </div>
              </template>
            </UPopover>
            <p v-else>null</p>
          </template>
        </UTable>


        <!-- Number of rows & Pagination -->

        <template #footer>
          <div class="flex flex-wrap justify-between items-center">
            <div>
              <span class="text-sm leading-5">
                Showing
                <span class="font-medium">{{ pageFrom }}</span>
                to
                <span class="font-medium">{{ pageTo }}</span>
                of
                <span class="font-medium">{{ filteredRows.length }}</span>
                results
              </span>
            </div>

            <UPagination v-model="page" :page-count="pageCount" :total="filteredRows.length" :ui="{
        wrapper: 'flex items-center gap-1',
        rounded: '!rounded-full min-w-[32px] justify-center',
        default: {
          activeButton: {
            variant: 'outline'
          }
        }
      }" />
          </div>
        </template>
      </UCard>

      <!-- in dashboard page do not show -->
      <review-questions v-if="!showInsert" />
    </div>
</template>


<style></style>