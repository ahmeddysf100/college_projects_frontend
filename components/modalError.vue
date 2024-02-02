<script lang="ts" setup>
const useModel = useMyModalErrorStore();
const isOpen = computed(() => useModel.modalIsOpen);
const header = computed(() => useModel.errorMessageHeader);
const message = computed({
  get: () => useModel.errorMessage,
  set: (val) => {
    useModel.errorMessage = val;
  },
});
const btnDelete = computed(() => useModel.btnDelete);

const close = () => {
  // useModel.setErrorMessage()
  // useModel.setErrorMessageHeader()
  // useModel.setModalIsOpen(false)
  useModel.setModalValues(false, "", "", false);
};

const useDashboard = useDashboardStore();
const countdown = ref(5);
const countNum = ref(false);
const deletion = async () => {
  await useDashboard.deleteOneQuestion(useModel.questionId);
  if (useDashboard.D_question) {
    // useModel.setModalValues(true, 'Done !', 'The question has been deleted. The page will be updated within 3 seconds', false);
    countNum.value = true;
    // Countdown and refresh the page
    useModel.setModalValues(
      true,
      "Done !",
      `The question has been deleted. The page will be updated within`,
      false
    );
    const updateCountdown = () => {
      if (countdown.value > 0) {
        message.value = `The question has been deleted. The page will be updated within`;
        countdown.value--;
        setTimeout(updateCountdown, 1000); // Call the function after 1 second
      } else {
        if (isOpen.value) {
          countNum.value = false;
          useRouter().go(0); // Refresh the page
        }
      }
    };

    setTimeout(updateCountdown, 1000); // Start the countdown
  }
};
</script>

<template>
  <div>
    <!-- <UButton label="Open" @click="isOpen = !isOpen" /> -->
    <p class="text-"></p>
    <UModal v-model="isOpen" prevent-close>
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold leading-6 text-red-600">
              {{ header }}
            </h3>
            <UButton color="red" variant="ghost" class="-my-1" @click="close">
              <svg
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </UButton>
          </div>
        </template>
        <UTextarea
          v-if="message.length > 200"
          autoresize
          v-model="message"
          readonly
          class="text-base"
        />
        <p v-else class="text-base font-semibold text-red-400">
          {{ message }}
          <span v-if="countNum" class="animate-spin text-white"
            >{{ countdown }}
            {{ countdown > 1 ? "seconds" : "second" }}
          </span>
        </p>
        <UButton
          v-if="btnDelete"
          label="Conferm Delete"
          @click="deletion"
          color="red"
          class="mt-3"
          block
        />
      </UCard>
    </UModal>
  </div>
</template>

<style></style>
