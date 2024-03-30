<script lang="ts" setup>
import type { arenaForDto, CreateArena } from '~/createArena';

const useDash = useDashboardStore();
const useUser = useUserStore()
const useArena = useMyCreateArenaStore()
const showInsert = ref(false)
const arenaId = computed(() => useArena.admin_arena_id)


const time = [30, 60, 90]
// const selectTime = ref(time[0])

const numPlayers = [1, 2, 3, 4, 5,]
// const selectNumPlayers = ref(numPlayers[0])

const createArena = reactive<arenaForDto>({
  arenaGear: useDash.selectedQuestions,
  roundTime: time[0],
  numOfPlayers: numPlayers[0],
  adminName: useUser.user?.username,
  hasStarted: false
})

const x = async () => {
  // Convert roundTime and numOfPlayers to numbers
  // createArena.roundTime = parseInt(createArena.roundTime as any);
  // createArena.numOfPlayers = parseInt(createArena.numOfPlayers as any);

  // Use unary plus operator to coerce roundTime and numOfPlayers into numbers
  createArena.roundTime = +createArena.roundTime;
  createArena.numOfPlayers = +createArena.numOfPlayers;
  console.log(createArena)
  await useArena.createArena(createArena)
  if (!!useArena.admin_arena_token) {
    console.log(useArena.admin_arena_token)
    navigateTo(`http://localhost:3000/arena/${arenaId.value}`, { external: true, replace: true })
  }
}
</script>


<template>
  <div v-motion :initial="{ opacity: 0, x: -1000 }" :visible="{ opacity: 1, x: 0, transition: { duration: 300 } }">
    <div class=" my-4 w-[95%] sm:w-[80%] mx-auto outline outline-offset-4 rounded-md outline-sky-500">
      <div class="flex flex-row gap-4 p-4">
        <UFormGroup label="Select the time of each round" class=" basis-2/4">
          <USelect class="" size="lg" v-model="createArena.roundTime" :options="time" />
        </UFormGroup>
        <UFormGroup label="Select the number of players who access the arena" class=" basis-2/4">
          <USelect class="" size="lg" v-model="createArena.numOfPlayers" :options="numPlayers" />
        </UFormGroup>
      </div>
    </div>
    <board :showInsert="showInsert" />
    <UButton @click="x" class=" grid mx-auto w-3/12 mb-4" size="xl" label="Create Arena" />
  </div>
</template>


<style></style>