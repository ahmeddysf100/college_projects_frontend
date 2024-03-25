<script lang="ts" setup>
import { io } from "socket.io-client";
const rout = useRoute();
const useUser = useUserStore()



onMounted(() => {
  // Define your headers
  const headers = {
    roomid: rout.params.id as string,  // Example header
    Authorization: useUser.token as string, // Example authorization header
  };
  console.log(headers)
  // Create the socket instance with extra headers
  const socket = io('http://192.168.31.170:3333', {
    // withCredentials:true,
    extraHeaders: headers,
    autoConnect: false,

  });
  // Connect to the socket server
  socket.connect();

  socket.emit('createSocket', {
    message: 'aaaaaaaaaaaa'
  })

  socket.on('onmessage', (i) => {
    console.log(i)
  })
})
console.log(rout.params.id);
</script>

<template>
  <div>
    <h1 class="text-center mt-10">{{ rout.params.id }}</h1>
  </div>
</template>

<style></style>
