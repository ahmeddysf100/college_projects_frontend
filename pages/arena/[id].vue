<script lang="ts" setup>
import { io } from "socket.io-client";
import type { Arena } from "~/createArena";
const useUser = useUserStore()
const useArena = useArenaStore()
const rout = useRoute();
const toast = useToast()

const token = useCookie('userArenaToken')
const adminId = useCookie('adminArenaId')
const arena = ref<Arena>()


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

  socket.on('exception',(data) => {
    toast.add({
      title: data,
      timeout: 10000
    })
    console.log(data)
  })


  socket.on("arena_updated", (data) => {
    console.log(data);
    arena.value = data.arenaData;

    toast.add({
      title: data.title
    })
  });
})
console.log(rout.params.id);
console.log(token.value);
</script>

<template>
  <div>
    <h1 class="text-center mt-10 text-red-500">{{ rout.params.id }}</h1>
    <h1 class="text-center mt-10 text-green-500">{{ adminId }}</h1>
    <p>{{ arena }}</p>
    <h1 class=" truncate">{{ token }}</h1>
  </div>
</template>

<style></style>
