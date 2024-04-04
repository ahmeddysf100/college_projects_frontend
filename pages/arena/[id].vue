<script lang="ts" setup>
import { io } from "socket.io-client";
import type { number, string } from "zod";
import type { Arena, Arena_updated, part, participant } from "~/createArena";
const useUser = useUserStore()
const useArena = useArenaStore()
const rout = useRoute();
const toast = useToast()

const token = useCookie('userArenaToken')
const adminId = useCookie('adminArenaId')
const arena = ref<Arena_updated | null>(null); // Initialize as null
// const arena = ref(); // Initialize as null
const arenaData = [
  { "3R1ZfxuKgE9kSO1fNhTS6": { "name": "ahha", "isOnline": true } },
  { "3R1ZfxuKgE9kSO1fNhTS7": { "name": "bhha", "isOnline": false } },
  { "3R1ZfxuKgE9kSO1fNhTS8": { "name": "chha", "isOnline": true } },
  { "3R1ZfxuKgE9kSO1fNhTSe": { "name": "ahha", "isOnline": true } },
  { "3R1ZfxuKgE9kSO1fNhTS1": { "name": "bhha", "isOnline": false } },
  { "3R1ZfxuKgE9kSO1fNhTS2": { "name": "chha", "isOnline": true } },
  { "3R1ZfxuKgE9kSO1fNhTSh": { "name": "ahha", "isOnline": true } },
  { "3R1ZfxuKgE9kSO1fNhTS3": { "name": "bhha", "isOnline": false } },
  { "3R1ZfxuKgE9kSO1fNhTS4": { "name": "chha", "isOnline": true } },
  { "3R1ZfxuKgE9kSO1fNhTSm": { "name": "ahha", "isOnline": true } },
  { "3R1ZfxuKgE9kSO1fNhTS5": { "name": "bhha", "isOnline": false } },
  { "3R1ZfxuKgE9kSO1fNhTSv": { "name": "chha", "isOnline": true } },
  { "3R1ZfxuKgE9kSO1fNhTSs": { "name": "ahha", "isOnline": true } },
  { "3R1ZfxuKgE9kSO1fNhTSk": { "name": "bhha", "isOnline": false } },
  { "3R1ZfxuKgE9kSO1fNhTSz": { "name": "chha", "isOnline": true } },
  { "3R1ZfxuKgE9SO1fNhTSzd": { "name": "chha", "isOnline": true } },
  { "3R1ZfxuKg9kSO1fNhTSsz": { "name": "chha", "isOnline": true } },
  { "3R1ZfxugE9kS1fNhvTtSz": { "name": "chha", "isOnline": true } },
  { "3R1ZfuKgE9kSO1fNhTvSz": { "name": "chha", "isOnline": true } },
  { "3R1fxuKgE9kSO1fNhTmSz": { "name": "chha", "isOnline": true } },
];
// const participants = computed(() => arenaData); // Use computed to ensure reactivity
const participants = computed(() => arena.value?.participants); // Use computed to ensure reactivity

const data = {
  "participants": {
    "E4TVX_OI5LB55sj38KU1u": {
      "name": "ahha",
      "isOnline": true
    },
    "E4TVX_OI5LssB55sj38KU1u": {
      "name": "ahha2",
      "isOnline": true
    },
    "E4TVX_OI5LffB55sj38KU1u": {
      "name": "ahha3",
      "isOnline": true
    }
  },
  "rankings": {
    "ahha": 0,
    "ahha2": 2,
    "ahha3": 4
  }
};

const rank = computed(() => useRank(arena.value?.participants, arena.value?.rankings))




onMounted(() => {
  // Define your headers
  // const headers = {
  //   roomid: rout.params.id as string,  // Example header
  //   Authorization: useUser.token as string, // Example authorization header
  // };
  // console.log(headers)
  // Create the socket instance with extra headers
  const socket = io('ws://192.168.31.170:3333/arena', {
    // withCredentials:true,
    // extraHeaders: headers,
    autoConnect: false,
    auth: {
      token: token.value,
    }

  });
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


  socket.on("arena_updated", (data) => {
    console.log(data);
    arena.value = data.arenaData;
    console.log(arena.value?.participants)
    // toast.add({
    //   title: data.title
    // })
  });
})
console.log(rout.params.id);
console.log(token.value);
</script>

<template>
  <div>
    <div v-if="participants && adminId"
      class="disable-scrollbars  divide-blue-200 flex flex-nowrap flex-col mx-auto mt-4 w-[99%] max-h-[23rem] gap-4 overflow-y-scroll border-4 rounded-md">
      <ArenaPlayer v-for="(item, index) in rank" :key="index" :item="item" :img="index" :name="item"
        :max="arena?.totalStages" />
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
</style>
