<script setup>
// light and dark function
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});

const useStore = useUserStore();
const useQuiz = useMyQuizStore();

const items = [
  [
    {
      label: null,
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      slot: "logout",
    },
  ],
];

const logout = () => {
  useStore.logout();
  useRouter().go(0);
};

const menuitems = [
  {
    title: "Features",
    path: "#",
  },
  {
    title: "Quiz",
    path: "/quiz",
  },
  {
    title: "About",
    path: "/about",
  },
  {
    title: "Dashboard",
    path: "/dashboard",
  },
];

const open = ref(false);
const windowWidth = ref();
onMounted(() => {
  if (process.client) {
    windowWidth.value = window.innerWidth;
    console.log(windowWidth);
  } else {
    console.log(
      "Code is running on the server side or in a context where window is not available."
    );
  }
})

const showTimer = computed(() => useQuiz.showTimer)
</script>

<template>
  <div
    class="sticky top-0 start-0 z-50 bg-opacity-30 dark:bg-opacity-30 bg-clip-padding backdrop-blur-[6px] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-600">
    <nav class="flex flex-row w-full items-center">
      <div class="max-w-screen-xl flex flex-wrap grow items-center justify-between mx-auto p-4">
        <NuxtLink to="" class="flex items-center space-x-3 rtl:space-x-reverse">
          <span class="self-center font-semibold whitespace-nowrap dark:text-white">نون و القلم</span>
          <img class="w-6 sm:w-12" src="/ahha-high-resolution-logo-transparent (10).svg" alt="Avatar" />
        </NuxtLink>

        <nav class="hidden w-auto lg:flex mt-0">
          <ul class="flex flex-row gap-3">
            <li v-for="item of menuitems" :key="item">
              <a :href="item.path" class="flex lg:px-3 py-2">
                {{ item.title }}
              </a>
            </li>
          </ul>
        </nav>

        <div class="flex items-center gap-4">
          <UDropdown v-if="useStore.user" mode="hover" :items="items"
            :ui="{ item: { disabled: 'cursor-text select-text' } }" :popper="{ arrow: true }">
            <ClientOnly>
              <UChip :size="windowWidth <= 640 ? 'xs' : 'xl'" :text="useStore.user ? useStore.user.username : ''">
                <img class="rounded-xl w-6 sm:w-12" src="/1540584346.svg" />
              </UChip>
            </ClientOnly>

            <template #account>
              <div class="text-left">
                <p>Signed in as</p>
                <p class="truncate font-medium text-gray-900 dark:text-white">
                  {{ useStore.user.email }}
                </p>
              </div>
            </template>
            <template #logout>
              <UButton color="red" class="text-left" icon="i-heroicons-arrow-left-on-rectangle" label="Sign out"
                @click="logout()" block />
            </template>
          </UDropdown>
        </div>
      </div>

      <ClientOnly>
        <UButton class="mx-3 p-2" size="xs" color="white" variant="gost" square aria-label="Theme"
          @click="isDark = !isDark">
          <!-- <UAvatar v-if="!isDark" src="/night-mode.svg" />
            <UAvatar v-else src="/light-mode.svg" /> -->
          <!-- <svg v-if="isDark" class="w-3 sm:w-5  stroke-[6] stroke-cyan-500 hover:fill-cyan-400" id="Layer_1"
                  data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.56 122.88">
                  <title>Dark mode</title>
                  <path
                     d="M121.85,87.3A64.31,64.31,0,1,1,36.88.4c2.94-1.37,5.92.91,4.47,4.47a56.29,56.29,0,0,0,75.75,77.4l.49-.27a3.41,3.41,0,0,1,4.61,4.61l-.35.69ZM92.46,74.67H92A16.11,16.11,0,0,0,76.2,58.93v-.52a15.08,15.08,0,0,0,11-4.72,15.19,15.19,0,0,0,4.72-11h.51a15.12,15.12,0,0,0,4.72,11,15.12,15.12,0,0,0,11,4.72v.51A16.13,16.13,0,0,0,92.46,74.67Zm10.09-46.59h-.27a7.94,7.94,0,0,0-2.49-5.81A7.94,7.94,0,0,0,94,19.78v-.27A7.94,7.94,0,0,0,99.79,17a8,8,0,0,0,2.49-5.8h.27A8,8,0,0,0,105,17a8,8,0,0,0,5.81,2.49v.27A8,8,0,0,0,105,22.27a7.94,7.94,0,0,0-2.49,5.81Zm-41.5,8h-.41a12.06,12.06,0,0,0-3.78-8.82A12.06,12.06,0,0,0,48,23.5v-.41a12.07,12.07,0,0,0,8.82-3.78,12.09,12.09,0,0,0,3.78-8.82h.41a12.08,12.08,0,0,0,3.77,8.82,12.09,12.09,0,0,0,8.83,3.78v.41a12.09,12.09,0,0,0-8.83,3.78,12.08,12.08,0,0,0-3.77,8.82Z" />
               </svg>
               <svg v-else class="w-3 sm:w-5 stroke-[4] fill-none stroke-cyan-500 hover:fill-cyan-600" id="Layer_1"
                  data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88">
                  <title>Light mode</title>
                  <path
                     d="M30,13.21A3.93,3.93,0,1,1,36.8,9.27L41.86,18A3.94,3.94,0,1,1,35.05,22L30,13.21Zm31.45,13A35.23,35.23,0,1,1,36.52,36.52,35.13,35.13,0,0,1,61.44,26.2ZM58.31,4A3.95,3.95,0,1,1,66.2,4V14.06a3.95,3.95,0,1,1-7.89,0V4ZM87.49,10.1A3.93,3.93,0,1,1,94.3,14l-5.06,8.76a3.93,3.93,0,1,1-6.81-3.92l5.06-8.75ZM109.67,30a3.93,3.93,0,1,1,3.94,6.81l-8.75,5.06a3.94,3.94,0,1,1-4-6.81L109.67,30Zm9.26,28.32a3.95,3.95,0,1,1,0,7.89H108.82a3.95,3.95,0,1,1,0-7.89Zm-6.15,29.18a3.93,3.93,0,1,1-3.91,6.81l-8.76-5.06A3.93,3.93,0,1,1,104,82.43l8.75,5.06ZM92.89,109.67a3.93,3.93,0,1,1-6.81,3.94L81,104.86a3.94,3.94,0,0,1,6.81-4l5.06,8.76Zm-28.32,9.26a3.95,3.95,0,1,1-7.89,0V108.82a3.95,3.95,0,1,1,7.89,0v10.11Zm-29.18-6.15a3.93,3.93,0,0,1-6.81-3.91l5.06-8.76A3.93,3.93,0,1,1,40.45,104l-5.06,8.75ZM13.21,92.89a3.93,3.93,0,1,1-3.94-6.81L18,81A3.94,3.94,0,1,1,22,87.83l-8.76,5.06ZM4,64.57a3.95,3.95,0,1,1,0-7.89H14.06a3.95,3.95,0,1,1,0,7.89ZM10.1,35.39A3.93,3.93,0,1,1,14,28.58l8.76,5.06a3.93,3.93,0,1,1-3.92,6.81L10.1,35.39Z" />
               </svg> -->

          <UToggle on-icon="i-heroicons-moon-solid" off-icon="i-heroicons-sun-solid" :model-value="isDark" color="gray"
            :size="windowWidth <= 640 ? 'sm' : 'lg'" />
        </UButton>
        <template #fallback>
          <div class="w-8 h-8" />
        </template>
      </ClientOnly>

      <UButton variant="gost" class="block lg:hidden mr-3" @click="open = !open" :size="windowWidth <= 426 ? 'sm' : 'lg'">
        <UIcon v-if="open" class="sm:w-7 sm:h-7 w-4 h-4" name="i-heroicons-x-mark-solid" />
        <UIcon v-if="!open" class="sm:w-7 sm:h-7 w-4 h-4" name="i-heroicons-bars-3-16-solid" />
      </UButton>
    </nav>

    <nav class="lg:hidden w-full mt-2 mb-10" :class="{ block: open, hidden: !open }">
      <ul class="flex flex-col ml-3">
        <li v-for="item of menuitems" :key="item">
          <a :href="item.path" class="flex py-2">
            {{ item.title }}
          </a>
        </li>
      </ul>
    </nav>
    <QuizQuestion v-if="showTimer === true" />
  </div>
</template>

<style>
nav {
  font-size: 10px;
}

@media (min-width: 640px) {
  nav {
    font-size: 15px
      /* 96px */
    ;
  }
}
</style>
