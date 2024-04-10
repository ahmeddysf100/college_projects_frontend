<script lang="ts" setup>
import { io } from "socket.io-client";
import { Clipboard } from "v-clipboard";
import type { Arena, Arena_updated, Arena_updated_data, Arena_updated_gear, part, participant, Ranks } from "~/createArena";
const useUser = useUserStore()
const useArena = useArenaStore()
const rout = useRoute();
const toast = useToast()

const token = useCookie('userArenaToken')
const adminId = useCookie('adminArenaId')
const arena = ref<Arena_updated_data | null>(null); // Initialize as null
const gear = ref<Arena_updated_gear | string | null>(null); // Initialize as null

// const participants = computed(() => arenaData); // Use computed to ensure reactivity
const participants = computed(() => arena.value?.participants); // Use computed to ensure reactivity



// const rank = computed(() => arena.value?.rankings)
const rank = ref<Ranks[]>([{ "name": "ahha1", "userId": "sx3ku2ZIVEkHcxlcBa0w81", "rank": 1 }, { "name": "ahha2", "userId": "sx3ku2ZIVEkHcxlcBa0w82", "rank": 2 }, { "name": "ahha3", "userId": "sx3ku2ZIVEkHcxlcBa0w83", "rank": 3 }, { "name": "ahha4", "userId": "sx3ku2ZIVEkHcxlcBa0w84", "rank": 3 }, { "name": "ahha5", "userId": "sx3ku2ZIVEkHcxlcBa0w85", "rank": 4 }, { "name": "ahha6", "userId": "sx3ku2ZIVEkHcxlcBa0w86", "rank": 2 },])



const socket = io('ws://192.168.31.170:3333/arena', {
  // withCredentials:true,
  // extraHeaders: headers,
  autoConnect: false,
  auth: {
    token: token.value,
  }

});

onMounted(() => {

  // Connect to the socket server
  socket.connect();

  socket.on("connect_error", (error) => {

    toast.add({
      title: error.message
    })

  });

  socket.on('exception', (data) => {
    toast.add({
      title: data,
      timeout: 10000
    })
    console.log(data)
  })


  socket.on("arena_updated", (data: Arena_updated) => {
    console.log(data);
    arena.value = data.arenaData;
    gear.value = data.gearData;
    useArena.arena_updated_gear = data.gearData

    console.log(arena.value?.participants)
    // console.log('gear',data.gearData)
    console.log('gear', useArena.arena_updated_gear)

    toast.add({
      title: data.title
    })
    useArena.arena_updated_data = data.arenaData
  });
  ///////////////////////////////////////////////////////////////////////////////////////////////////////



  const targetElement = document.getElementById('scrolltarget');
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth' });
  }

})

const startArena = () => {
  socket.emit('start_arena', (data: any) => {

  })
}

const nominate = (data: any) => {
  socket.emit('nominate', {
    Q_id: data.Q_id,
    text: data.text
  })
}


console.log(rout.params.id);
console.log(token.value);

const shufle = () => {
  // rank.value.sort((a, b) => Math.random() - 0.5); // Shuffle the rank array

  //   rank.value = 
  //   [
  //     { "name": "ahha2", "userId": "sx3ku2ZIVEkHcxlcBa0w82", "rank": 1 },
  //     { "name": "ahha1", "userId": "sx3ku2ZIVEkHcxlcBa0w81", "rank": 3 },
  //     { "name": "ahha1", "userId": "sx3ku2ZIVEkHcxlcBa0w1", "rank": 3 },
  //     { "name": "ahha4", "userId": "sx3ku2ZIVEkHcxlcBa0w84", "rank": 2 },
  //     { "name": "ahha3", "userId": "sx3ku2ZIVEkHcxlcBa0w83", "rank": 1 },
  //     { "name": "ahha6", "userId": "sx3ku2ZIVEkHcxlcBa0w86", "rank": 2 },
  //     { "name": "ahha5", "userId": "sx3ku2ZIVEkHcxlcBa0w85", "rank": 4 },]


}

const isOnline = (userId: any) => {
  return computed(() => participants.value?.[userId]?.isOnline || false);
}

const toClipBoard = () => {
  try {
    const x = Clipboard.copy(rout.params.id)
    console.log(x)
    toast.add({
      title: `coped`
    })
  } catch (error) {
    toast.add({
      title: error as string
    })
  }
}
</script>

<template>
  <div class="">

    <div class="flex flex-row my-4 mx-4 gap-4 ">
      <div class=" basis-1/4  ">
        <UCard class=" "
          :ui="{ body: { base: ' grid place-content-center' }, header: { background: 'bg-cyan-500 rounded-t-3xl shadow-xl shadow-gray-950 ' }, rounded: 'rounded-3xl' }">
          <template class="" #header>
            <p class="text-center font-bold text-2xl">leader board</p>
          </template>
          <label for="copy" class=" font-semibold mb-2">copy arena id</label>
          <UButtonGroup id="copy" size="lg" orientation="horizontal">
            <UInput class="text-center" v-model="rout.params.id" color="blue" variant="outline" readonly />
            <UTooltip text="copy" :popper="{ placement: 'bottom' }">
              <UButton @click="toClipBoard" color="blue" variant="outline" icon="i-heroicons-clipboard-document" />
            </UTooltip>
          </UButtonGroup>
        </UCard>

        <UCard class="mt-4"
          :ui="{ header: { background: 'bg-cyan-500 rounded-t-3xl shadow-xl shadow-gray-950 ' }, rounded: 'rounded-3xl' }">
          <!-- <template class="" #header>
            <p class="text-center font-bold text-2xl">leader board</p>
          </template> -->
          <ArenaTimer v-if="gear" />

          <div v-else class="flex items-center space-x-4">
            <div class="space-y-2">
              <USkeleton class="h-[320px] w-[320px]" :ui="{ rounded: 'rounded-xl' }" />
            </div>
          </div>
        </UCard>
      </div>


      <div class="basis-1/2 ">
        <UCard
          :ui="{ header: { background: 'bg-cyan-500 rounded-t-3xl shadow-xl shadow-gray-950 ' }, rounded: 'rounded-3xl', body: { padding: 'p-0 sm:py-0 sm:p-4' } }">
          <template class="" #header>
            <p class="text-center font-bold text-2xl">leader board</p>
          </template>
          <ArenaQuestions v-if="gear" id="scrolltarget" :nominate="nominate"/>

          <div v-else class="flex items-center space-y-6">
            <div class="space-y-2">
              <USkeleton class="h-[32rem] w-[41rem]" :ui="{ rounded: 'rounded-xl' }" />
              <USkeleton class="h-[2rem] w-[41rem]" :ui="{ rounded: 'rounded-xl' }" />
            </div>
          </div>
        </UCard>
      </div>


      <div class="basis-1/4 ">
        <UCard
          :ui="{ header: { background: 'bg-cyan-500 rounded-t-3xl shadow-xl shadow-gray-950 ' }, rounded: 'rounded-3xl' }">
          <template class="" #header>
            <p class="text-center font-bold text-2xl">leader board</p>
          </template>
          <div v-if="participants"
            class="disable-scrollbars  flex flex-nowrap flex-col mx-auto mt-4 transition-container max-h-[10rem] hover:max-h-[28rem]  gap-4 overflow-y-scroll border-y-4 border-y-indigo-300 px-4 rounded-3xl">
            <TransitionGroup name="list">
              <ArenaPlayer v-for="(item, index) in rank" :key="item.userId" :item="item" :img="index" :name="item"
                :max="arena?.totalStages" :participants="isOnline(item.userId)" />
            </TransitionGroup>
          </div>

          <div v-else class="flex items-center space-x-4">
            <USkeleton class="h-[14rem] w-[20rem]" />
          </div>
          <!-- <UButton label="shufle" @click="shufle" /> -->
        </UCard>
      </div>
    </div>
    <div class="grid">
      <UButton @click="startArena" class=" w-80 mx-auto text-2xl font-bold  " label="start" size="xl" block />
    </div>



    <h1 class="text-center mt-10 text-red-500">{{ rout.params.id }}</h1>
    <h1 class="text-center mt-10 text-green-500">{{ adminId }}</h1>
    <p>{{ arena }}</p>
    <h1 class=" truncate">{{ token }}</h1>
    <code>{{ rank }}</code>
  </div>
</template>

<style>
.disable-scrollbars::-webkit-scrollbar {
  background: transparent;
  /* Chrome/Safari/Webkit */
  width: 0px;
}

.disable-scrollbars {
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE 10+ */
}


.transition-container {
  transition: max-height 0.5s ease;
}





.list-move,
/* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
  /* width: 100%; */
}
</style>
