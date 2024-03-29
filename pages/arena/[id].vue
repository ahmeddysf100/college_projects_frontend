<script lang="ts" setup>
import { io } from "socket.io-client";
const rout = useRoute();
const useUser = useUserStore()
const useArena= useMyCreateArenaStore()
const token = computed(()=> useArena.admin_arena_token || '21212')
const arena = ref()

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

  socket.emit('createSocket', {
    message: 'aaaaaaaaaaaa'
  })

  socket.on('onmessage', (i) => {
    console.log(i)
  })

  socket.on("arena_updated", (data) => {
  console.log(data);
  arena.value = JSON.stringify(data,null,2)
});
})
console.log(rout.params.id);
</script>

<template>
  <div>
    <h1 class="text-center mt-10">{{ rout.params.id }}</h1>
    <p>{{ arena }}</p>
  </div>
</template>

<style></style>
