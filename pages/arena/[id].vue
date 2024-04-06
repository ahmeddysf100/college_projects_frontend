<script lang="ts" setup>
import { io } from "socket.io-client";
import type { Arena, Arena_updated, part, participant, Ranks } from "~/createArena";
const useUser = useUserStore()
const useArena = useArenaStore()
const rout = useRoute();
const toast = useToast()

const token = useCookie('userArenaToken')
const adminId = useCookie('adminArenaId')
const arena = ref<Arena_updated | null>(null); // Initialize as null
// const arena = ref(); // Initialize as null

// const participants = computed(() => arenaData); // Use computed to ensure reactivity
const participants = computed(() => arena.value?.participants); // Use computed to ensure reactivity



const rank = computed(() => arena.value?.rankings)
// const rank = ref<Ranks[]>([
//   { "name": "ahha1", "userId": "sx3ku2ZIVEkHcxlcBa0w81", "rank": 1 },
//   { "name": "ahha2", "userId": "sx3ku2ZIVEkHcxlcBa0w82", "rank": 2 },
//   { "name": "ahha3", "userId": "sx3ku2ZIVEkHcxlcBa0w83", "rank": 3 },
//   { "name": "ahha4", "userId": "sx3ku2ZIVEkHcxlcBa0w84", "rank": 3 },
//   { "name": "ahha5", "userId": "sx3ku2ZIVEkHcxlcBa0w85", "rank": 4 },
//   { "name": "ahha6", "userId": "sx3ku2ZIVEkHcxlcBa0w86", "rank": 2 },])




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

</script>

<template>
  <div>
    <div v-if="participants  "
      class="disable-scrollbars  divide-blue-200 flex flex-nowrap flex-col mx-auto mt-4 w-[99%]  max-h-[23rem] gap-4 overflow-y-scroll border-4 rounded-md">
      <TransitionGroup name="list">
        <ArenaPlayer v-for="(item, index) in rank" :key="item.userId" :item="item" :img="index" :name="item"
          :max="arena?.totalStages" :participants="isOnline(item.userId)" />


        <!-- <div class="pt-3 border" v-for="(item, index) in rank" :key="item.userId">
          <UProgress :value="item.rank" :max="arena?.totalStages" color="primary" size="lg">
            <template #indicator="{ percent }">
              <div class="text-right" :style="{ width: `${percent}%` }">
                <UChip :color="participants[item.userId] === true ? 'primary' : 'red'"
                  :text="participants[item.userId] === true ? 'online' : 'offline'" size="2xl" inset>
                  <UAvatar :src="`https://i.pravatar.cc/1000?img=${index + 1}`" size="xl" />
                </UChip>
                <p>{{ item.name }}/<span class="text-red-500 font-bold">{{ percent }}%</span></p>
              </div>
            </template>
</UProgress>
</div> -->
      </TransitionGroup>

    </div>
    <UButton label="shufle" @click="shufle" />

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
}
</style>
