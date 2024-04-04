<script lang="ts" setup>
const useStore = useUserStore();
const useQuiz = useMyQuizStore();

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
    title: "Arena",
    path: "/arena",
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
    // console.log(windowWidth.value);
  } else {
    console.log(
      "Code is running on the server side or in a context where window is not available."
    );
  }
})

const showTimer = computed(() => useQuiz.timerPosition === 'nav' ? useQuiz.showTimer : false)
</script>

<template>
  <ClientOnly>
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
              <li v-for="item of menuitems" :key="item.title">
                <a :href="item.path" class="flex lg:px-3 py-2">
                  {{ item.title }}
                </a>
              </li>
            </ul>
          </nav>

          <div class="flex items-center gap-4">
            <UDropdown v-if="useStore.user" mode="hover" :items="items"
              :ui="{ item: { disabled: 'cursor-text select-text' } }" :popper="{ arrow: true }">
              <UChip :size="windowWidth <= 640 ? 'xs' : 'xl'" :text="useStore.user ? useStore.user.username : ''">
                <img class="rounded-xl w-6 sm:w-12" src="/1540584346.svg" />
              </UChip>

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

        <UButton class="mx-3 p-2" size="xs" color="white" variant="ghost" square aria-label="Theme"
          @click="isDark = !isDark">
          <UToggle on-icon="i-heroicons-moon-solid" off-icon="i-heroicons-sun-solid" :model-value="isDark" color="indigo"
            :size="windowWidth <= 640 ? 'sm' : 'lg'" />
        </UButton>


        <UButton variant="ghost" class="block lg:hidden mr-3" @click="open = !open"
          :size="windowWidth <= 426 ? 'sm' : 'lg'">
          <UIcon v-if="open" class="sm:w-7 sm:h-7 w-4 h-4" name="i-heroicons-x-mark-solid" />
          <UIcon v-if="!open" class="sm:w-7 sm:h-7 w-4 h-4" name="i-heroicons-bars-3-16-solid" />
        </UButton>
      </nav>

      <nav class="lg:hidden w-full mt-2 mb-10" :class="{ block: open, hidden: !open }">
        <ul class="flex flex-col ml-3">
          <li v-for="item of menuitems" :key="item.title">
            <a :href="item.path" class="flex py-2">
              {{ item.title }}
            </a>
          </li>
        </ul>
      </nav>
      <QuizQuestion v-if="showTimer === true" />
    </div>
  </ClientOnly>
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
