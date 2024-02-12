<script setup>
const useDashboard = useDashboardStore();
const useModel = useMyModalErrorStore();

const items = [
  {
    slot: "insert",
    label: "Insert",
  },
  {
    slot: "delete",
    label: "Delete",
  },
];

const isOpen = ref(false);
const options = ref([]);
const correct = ref('');
let tempOptions = ref();
const optionMessage = ref();
const selectSubject = [
  "ashkal",
  "lost numbers",
  "verbal",
  "Sequences",
  "Arithmetic and logical operations",
];
const selectLevel = ["1", "2", "3"];
const selectType = ["answer", "multiple options"];
const selectBox = ref(false);
const optionsRadio = [
  { value: 'false', label: 'is false', icon: 'i-heroicons-x-mark-solid' },
  { value: 'true', label: 'is true', icon: 'i-heroicons-check-20-solid' },
]

const insertForm = reactive({
  subject_name: selectSubject[0],
  email: "ah&ha@gmail.com",
  level: selectLevel[0],
  type: selectType[0],
  Q_text: null,
  correctAnswer: null,
  explanationText: null,
  answers: null,
});

watchEffect(() => {
  if (insertForm.type === "answer") {
    insertForm.answers = null;
    insertForm.correctAnswer = correct.value.length > 0 ? correct.value : null;
  } else {
    insertForm.answers = optionsJsonString.value;
    insertForm.correctAnswer = null;
  }
});

const addOption = () => {
  console.log(tempOptions)
  // optionMessage.value = options.value.includes(tempOptions.value) ? "This option is already exist" : null;
  // optionMessage.value = tempOptions.value === null ? "Please enter value first" : null;
  if (!tempOptions.value || !options.value.includes(tempOptions.value)) {
    options.value.push({
      A_Text: tempOptions.value,
      isCorrect: selectBox.value.toString(),
    }); // Access the value property
    tempOptions.value = ""; // Update the value property
    optionMessage.value = ""; // Access the value property
    selectBox.value = false;
  } else {
    tempOptions.value = "";
  }
  // console.log(options.value[0])
  // console.log(insertForm)
};

function removeOption(option) {
  options.value = options.value.filter((item) => {
    return item !== option;
  });
}

const optionsJsonString = computed(() =>
  JSON.stringify(options.value, null, 2)
);

function updateOptions(event) {
  try {
    options.value = JSON.parse(event.target.value);
  } catch (error) {
    // Handle parsing error
    console.error("Invalid JSON format:", error.message);
  }
}

const imageUrl1 = ref(null);
function handleFileUpload1(event) {
  const file = event.target.files[0];

  // If there's already an image1, delete it from the FormData
  if (formData.has("image1")) {
    formData.delete("image1");
  }

  // Append the new file to FormData with the key "image1"
  formData.append("image1", file);

  // Update the imageUrl1 to display the new image
  imageUrl1.value = URL.createObjectURL(file);
}

const imageUrl2 = ref(null);
function handleFileUpload2(event) {
  const file = event.target.files[0];

  // If there's already an image1, delete it from the FormData
  if (formData.has("image2")) {
    formData.delete("image2");
  }

  // Append the new file to FormData with the key "image1"
  formData.append("image2", file);

  // Update the imageUrl1 to display the new image
  imageUrl2.value = URL.createObjectURL(file);
}

let formData = new FormData();

async function onSubmitinsert() {
  if ((insertForm.answers === null && insertForm.correctAnswer === null) || (!formData.has('image1')) && insertForm.Q_text === null) {
    useModel.setModalValues(
      true,
      "Bad Request",
      "You cannot send a blank form"
    );
  } else {
    console.log("Submitted form:", insertForm);
    // // Remove old insertForm data from formData
    // for (const key of formData.keys()) {
    //   formData.delete(key);
    // }


    // Append new insertForm data to formData
    for (const [key, value] of Object.entries(insertForm)) {
      formData.delete(key);
      formData.append(key, value);
    }

    imageUrl1.value = null;
    imageUrl2.value = null;
    await useDashboard.insertQuestion(formData);
    if (useDashboard.insertRes) {
      insertForm.Q_text = insertForm.correctAnswer =
        insertForm.answers = insertForm.explanationText = null
      useModel.setModalValues(
        true,
        "Question Added Successfully",
        useDashboard.insertRes
      );
      await prefetchComponents();
    }

    for (var key of formData.entries()) {
      console.log({ a: key[0], b: key[1] });
    }

    formData = new FormData(); // Reset formData
    console.log(useDashboard.insertRes);
  }

}

//delete formmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm

const deleteForm = reactive({ questionId: "" });

async function onDeletion() {
  console.log("Submitted form:", deleteForm);
  await useDashboard.getOneQuestion(deleteForm.questionId);
  if (useDashboard.questionById.length > 4) {
    await useModel.setQuestionId(deleteForm.questionId);
    useModel.setModalValues(
      true,
      "Confirm deletion",
      useDashboard.questionById,
      true
    );
  } else {
    useModel.setModalValues(
      true,
      "This question not exist",
      useDashboard.questionById.response,
      false
    );
  }
}
</script>

<template>
  <ModalError />
  <UTabs :items="items" class="w-auto">
    <template #insert="{ item }">
      <UCard>
        <template #header>
          <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ item.label }}
          </p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Insert question to the database. Click add when you're done.
          </p>
        </template>

        <UForm @submit="onSubmitinsert">
          <UFormGroup label="Subject Name" name="subject_name" class="mb-3" required>
            <USelectMenu v-model="insertForm.subject_name" :options="selectSubject" />
          </UFormGroup>

          <UFormGroup label="Email" name="email" class="mb-3" required>
            <UInput dir="auto" v-model="insertForm.email" />
          </UFormGroup>

          <UFormGroup label="Level" name="level" class="mb-3" required>
            <USelectMenu :options="selectLevel" v-model="insertForm.level" />
          </UFormGroup>

          <UFormGroup label="Type" name="type" class="mb-3" required>
            <USelectMenu v-model="insertForm.type" :options="selectType" />
          </UFormGroup>

          <UFormGroup v-if="insertForm.type === 'multiple options'" class="mb-4">
            <UButton size="xs" label="Add multiple chooses" class="mb-3" @click="isOpen = true" />
            <UTextarea dir="auto" readonly color="indigo" variant="outline" :value="optionsJsonString" @input="updateOptions"
              placeholder="multiple options..." />

            <UModal v-model="isOpen" prevent-close>
              <UCard :ui="{
                ring: '',
                divide: 'divide-y divide-gray-100 dark:divide-gray-800',
              }">
                <template #header>
                  <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                      Options Form
                    </h3>
                    <UButton color="primary" variant="ghost" class="-my-1" @click="isOpen = false">
                      <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </UButton>
                  </div>
                </template>
                <UFormGroup class="mb-10" label="Enter options" required>
                  <div class="grid grid-rows-1 grid-cols-2 gap-5">
                    <UInput dir="auto" class="mb-2 justify-stretch" v-model="tempOptions" />
                    <URadioGroup v-model="selectBox" :options="optionsRadio">
                      <template #label="{ option }">
                        <p class="italic ">
                          <UIcon :name="option.icon" />
                          {{ option.label }}
                        </p>
                      </template>
                    </URadioGroup>
                    <!-- <UCheckbox class="" v-model="selectBox" name="notifications" label="is true" /> -->
                    <p dir="auto" class="text-left text-red-500 rounded-sm mb-2">
                      {{ optionMessage }}
                    </p>
                  </div>
                  <UButton class="justify-self-start" label="Add" @click="addOption" block />
                </UFormGroup>

                <div class="flex flex-wrap gap-1">
                  <div v-for="option in options" :key="option">
                    <p class="break-all rounded bg-slate-600 mt-1 ml-1 px-1 cursor-pointer text-xl hover:bg-rose-700"
                      @click="removeOption(option)">
                      {{ option }}
                    </p>
                  </div>
                </div>
              </UCard>
            </UModal>
          </UFormGroup>

          <UFormGroup name="correctAnswer" class="mb-3" v-else-if="insertForm.type === 'answer'" label="Correct Answer"
            required>
            <UInput color="indigo" v-model="correct" />
          </UFormGroup>

          <UFormGroup label="Question Text" name="Q_text" class="mb-3">
            <UTextarea dir="auto" autoresize v-model="insertForm.Q_text" />
          </UFormGroup>

          <UFormGroup label="Question image" name="image1" class="mb-3">
            <UInput dir="auto" type="file" @change="handleFileUpload1" />
            <img v-if="imageUrl1" class="h-40 w-60 mx-auto my-10 sm:h-60 sm:w-80" :src="imageUrl1" />
          </UFormGroup>

          <UFormGroup label="Explanation Text" name="explanationText" class="mb-3">
            <UTextarea dir="auto" autoresize v-model="insertForm.explanationText" />
          </UFormGroup>

          <UFormGroup label="Answer image" name="image2" class="mb-3">
            <UInput dir="auto" type="file" @change="handleFileUpload2" />
            <img v-if="imageUrl2" class="h-40 w-60 mx-auto my-10 sm:h-60 sm:w-80" :src="imageUrl2" />
          </UFormGroup>

          <UButton type="submit" label="Add" block />
        </UForm>
      </UCard>
    </template>

    <!-- delete formmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm -->
    <template #delete="{ item }">
      <UCard @submit.prevent="onDeletion">
        <template #header>
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            {{ item.label }}
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Delete question. After saving, you will get the question information
            to confirm the deletion.
          </p>
        </template>

        <UFormGroup label="Question Id" name="current" required class="mb-3">
          <UInput v-model="deleteForm.questionId" type="text" required />
        </UFormGroup>

        <template #footer>
          <UButton type="submit" label="Save" block />
        </template>
      </UCard>
    </template>
  </UTabs>
</template>
