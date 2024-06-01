<script lang="ts" setup>
import { io } from "socket.io-client";
import { Clipboard } from "v-clipboard";
import type { Arena, OfflinePlayers, Arena_updated, Arena_updated_data, Arena_updated_gear, part, participant, Ranks } from "~/createArena";
const useUser = useUserStore()
const useArena = useArenaStore()
const rout = useRoute();
const toast = useToast()
const ip = useRuntimeConfig().public.IP_HOME;

const token = useCookie('userArenaToken')
const adminId = useCookie('adminArenaId')
const arena = ref<Arena_updated_data | null>(null); // Initialize as null
const gear = ref<Arena_updated_gear | string>(); // Initialize as null
const showGear = ref<boolean>(false)
const offlinePlayers = ref<OfflinePlayers[]>()

// const participants = computed(() => arenaData); // Use computed to ensure reactivity
const participants = computed(() => arena.value?.participants); // Use computed to ensure reactivity



const ranks = computed(() => arena.value?.rankings)
// const rank = ref<Ranks[]>([{ "name": "ahha1", "userId": "sx3ku2ZIVEkHcxlcBa0w81", "rank": 1 }, { "name": "ahha2", "userId": "sx3ku2ZIVEkHcxlcBa0w82", "rank": 2 }, { "name": "ahha3", "userId": "sx3ku2ZIVEkHcxlcBa0w83", "rank": 3 }, { "name": "ahha4", "userId": "sx3ku2ZIVEkHcxlcBa0w84", "rank": 3 }, { "name": "ahha5", "userId": "sx3ku2ZIVEkHcxlcBa0w85", "rank": 4 }, { "name": "ahha6", "userId": "sx3ku2ZIVEkHcxlcBa0w86", "rank": 2 },])



const socket = io(`ws://${ip}:3333/arena`, {
  // withCredentials:true,
  // extraHeaders: headers,
  autoConnect: false,
  auth: {
    token: token.value,
  },
  transports:['websocket'], 

});


const start_time = ref(3)
const isOpen = ref<boolean>()


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

    // const participantsArray = Object.values(arena.value?.participants || {});
    // const Offline = participantsArray.filter(i => i && i.isOnline === false);
    // offlinePlayers.value = Offline
    // console.log('offline players', Offline);

    offlinePlayers.value = Object.keys(arena.value.participants).filter(id => !arena.value?.participants[id].isOnline).map(id => ({ id, name: arena.value?.participants[id].name }));
    //      offlinePlayers.value = [
    //   { "id": "nCzQxk3LY938ETKWNpXHp", "name": "student" },
    //   { "id": "vYRpN85AGpZu4MzBEG4uH", "name": "teacher" },
    //   { "id": "Z7fKgEa6JTBWwL98aDr4T", "name": "parent" },
    //   { "id": "Rn6D4MzHk3XhLTuPNZ8aY", "name": "manager" },
    //   { "id": "C92B3hNz6LmETWxkqXPHp", "name": "engineer" },
    //   { "id": "aYDz6jWQpNcXLK3mTP89H", "name": "artist" },
    //   { "id": "8ZxL3HmNcpWQjY4TPK7Ba", "name": "developer" },
    //   { "id": "4X7YjN8cZa9pWQLTKm3bH", "name": "designer" },
    //   { "id": "nTj8bH3cW9mKXLYZaPp4Q", "name": "writer" },
    //   { "id": "cYjWmK3LNpQaT9H4Z8Xb7", "name": "scientist" },
    //   { "id": "L3ZKNxTpXbWmYc9PH4a7j", "name": "doctor" },
    //   { "id": "N6ZcLYpQ3HWmTXbKa8j9d", "name": "nurse" },
    //   { "id": "K4LWQmN3THXbpcZjY7a9d", "name": "pilot" },
    //   { "id": "qNcXK3WpHmLTZ8aYPb94j", "name": "chef" },
    //   { "id": "jWpLN4cTQKXb9aPmHY3Z8", "name": "athlete" },
    //   { "id": "pN3cY4KW9LXbqTHm8HaZj", "name": "musician" },
    //   { "id": "H4LYj3Xb9aKWmPQTLcZN8", "name": "actor" },
    //   { "id": "T9pNcYmLWjHXb4Q3K7Za8", "name": "dancer" },
    //   { "id": "mW3LXbHKc9NjZaP8Qp7T4", "name": "architect" },
    //   { "id": "N3mKcZp8WYjTXbLaHP94q", "name": "entrepreneur" }
    // ];
  });

  ///////////////////////////////////////////////////////////////////////////////////////////////////////





})
type ArenaUpdatedGearOrString = Arena_updated_gear | string | null;

const question = computed(() => useArena.arena_updated_gear as ArenaUpdatedGearOrString)
const start_count = ref()
const is_Stages_Finshed = ref(false)

//when player rejoin the question will update
watch(question, async (newValue) => {
  if (newValue !== 'FINSHED') {
    start_time.value = 3
    clearInterval(start_count.value)
    showGear.value = false;
    isOpen.value = true

    start_count.value = setInterval(() => {
      start_time.value--
      if (start_time.value <= 0) {
        isOpen.value = false
        showGear.value = true;
        clearInterval(start_count.value)
      }
    }, 1500)

  } else if (newValue === 'FINSHED') {
    is_Stages_Finshed.value = true;
  }
});


const offlineMode = ref(false);
watch(arena, async (newValue) => {

  //(offlinePlayers.value?.length ?? 0) checks if offlinePlayers.value is undefined. If it is, it uses 0 as the default value for the length property.
  //This ensures that even if offlinePlayers.value is undefined, the expression (offlinePlayers.value?.length ?? 0) will always result in a number, preventing the TypeScript warning.
  if (newValue?.hasStarted === true && (offlinePlayers.value?.length ?? 0) > 0) {
    console.log('off off off', offlinePlayers.value)
    offlineMode.value = true;
  }
  //This is essentially the same behavior as the logical OR (||) operator in this context,
  // However, the nullish coalescing operator (??) is specifically designed to handle null and undefined values, whereas the logical OR (||) operator would also evaluate to the right-hand operand if the left-hand operand is a falsy value such as 0, "", NaN, or false.
  if (newValue?.hasStarted === true && (offlinePlayers.value?.length ?? 0) === 0) {
    offlineMode.value = false;
    console.log('onn onn onn');
  }

})

const startArena = () => {
  socket.emit('start_arena', (data: any) => {

  })
}

const currentStage = computed(() => arena.value?.currentStage || 0)
const totaltStage = computed(() => arena.value?.totalStages || 1)
const time_out = () => {
  console.log('time_outttttttttt')
  socket.emit('time_out', {
    Q_id: gear.value?.id,
    currentStage: currentStage.value
  })
}


const nominate = (data: any) => {
  console.log('emit/id', data)
  socket.emit('nominate', {
    Q_id: data.Q_id,
    text: data.text
  })
}

const remove_participant = (x: any) => {
  console.log(`remove_participant: ${x.name}`)
  socket.emit('remove_participant', {
    id: x.id,
    name: x.name
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

const show_countTime = computed(() => {
  if (isOpen.value === true && offlineMode.value === false) {
    return true
  } else {
    return false
  }
})
</script>

<template>

<div v-if="is_Stages_Finshed === false">
  <UModal v-model="offlineMode"
    :ui="{ background: 'bg-gray-200/[0] dark:bg-gray-800/[0]' }" fullscreen>
    <div class=" mt-40 grid place-content-center">
      <h1 class="font-extrabold text-pretty text-3xl text-center">Waiting for players to return. Only the admin can kick
        offline
        players
      </h1>
      <div class="loader my-8 mx-auto "></div>
      <div class="centerDevXY flex flex-wrap justify-center ">
        <ArenaWaitForPlayers v-for="(item, index) in offlinePlayers" :key="index"
          @remove_participant="remove_participant" :offlinePlayer="item" />
      </div>
    </div>
  </UModal>
</div>


  <div>

    <div v-if="is_Stages_Finshed === true">
      <ArenaResults :max="arena?.totalStages" :players="ranks" />
      <!-- <USkeleton class="h-svh w-svw" :ui="{ rounded: 'rounded-xl' }" />
      {{ is_Stages_Finshed }}
      {{ currentStage }} -->
    </div>

    <div v-else class="">

      <UModal v-model="show_countTime" :ui="{ background: 'bg-gray-200/[0] dark:bg-gray-800/[0]' }" prevent-close
        fullscreen>
        <div class="countdown">{{ start_time }}</div>
        <button @click=""></button>
      </UModal>

      <div class="flex flex-col sm:flex-row my-4 mx-4 gap-4 ">
        <div class=" basis-1/4  ">
          <UCard class=" "
            :ui="{ body: { base: ' grid place-content-center' }, header: { background: 'bg-cyan-500 rounded-t-3xl shadow-xl dark:shadow-gray-950  shadow-gray-300 ' }, rounded: 'rounded-3xl' }">
            <template class="" #header>
              <p class="text-center font-bold text-2xl">Game details</p>
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
            :ui="{ header: { background: 'bg-cyan-500 rounded-t-3xl shadow-xl dark:shadow-gray-950  shadow-gray-300 ' }, rounded: 'rounded-3xl' }">
            <!-- <template class="" #header>
            <p class="text-center font-bold text-2xl">leader board</p>
          </template> -->
            <ArenaTimer v-if="showGear && offlineMode === false" @timeOut="time_out" />

            <div v-else class="flex items-center space-x-4">
              <div class="space-y-2  w-full">
                <USkeleton class="h-[320px] " :ui="{ rounded: 'rounded-xl' }" />
              </div>
            </div>
          </UCard>
        </div>


        <div class="basis-1/2 ">
          <UCard
            :ui="{ header: { background: 'bg-cyan-500 rounded-t-3xl shadow-xl dark:shadow-gray-950  shadow-gray-300 ' }, rounded: 'rounded-3xl', body: { padding: 'p-4  ' } }">
            <template class="" #header>
              <p class="text-center font-bold text-2xl">Arena Questions</p>
            </template>
            <ArenaQuestions v-if="showGear && offlineMode === false" @nominate="nominate" />

            <div v-else class="flex items-center space-x-4">
              <div class="space-y-2 w-full">
                <USkeleton class="h-[32rem] " :ui="{ rounded: 'rounded-xl' }" />
                <USkeleton class="h-[2rem] " :ui="{ rounded: 'rounded-xl' }" />
              </div>
            </div>
          </UCard>
        </div>


        <div class="basis-1/4 ">
          <UCard
            :ui="{ header: { background: 'bg-cyan-500 rounded-t-3xl shadow-xl dark:shadow-gray-950  shadow-gray-300 ' }, rounded: 'rounded-3xl' }">
            <template class="" #header>
              <p class="text-center font-bold text-2xl">leader board</p>
            </template>
            <div v-if="ranks"
              class="disable-scrollbars  flex flex-nowrap flex-col mx-auto mt-4 transition-container max-h-[15rem] hover:max-h-[35rem]  gap-4 overflow-y-scroll border-y-4 border-y-indigo-300 px-4 rounded-3xl">
              <TransitionGroup name="list">
                <ArenaPlayer v-for="(item, index) in ranks" :key="item.name" :item="item" :img="index" :name="item"
                  :max="arena?.totalStages" :participants="isOnline(item.id)" />
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
      <code>{{ ranks }}</code>
    </div>
  </div>
</template>

<style scoped>
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


/*//////////////start_count///////////// */
.background2 {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  overflow: hidden;

}

.background {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  height: 40%;
  overflow: hidden;

  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}



.countdown {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 5rem;
  /* Adjust font size as needed */
}

/* loadeer */
.loader {
  position: relative;
  transform: scale(2);
  border-radius: 50%;
  border: 1px solid;
  width: 30px;
  height: 30px;
  color: white;
}

.loader::after {
  position: absolute;
  width: 0px;
  height: 10px;
  display: block;
  border-left: 1px solid #fff;
  content: '';
  left: 14px;
  border-radius: 1px;
  top: 4px;
  animation-duration: 1s;
}

.loader::before {
  position: absolute;
  width: 0px;
  height: 10px;
  display: block;
  border-left: 1px solid #fff;
  content: '';
  left: 14px;
  border-radius: 1px;
  top: 4px;
  animation-duration: 40s;
}

.loader::before,
.loader::after {
  transform-origin: bottom;
  animation-name: dial;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes dial {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}







/*/////////transition ////////////*/

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
