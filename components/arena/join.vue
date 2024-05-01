<script lang="ts" setup>
import type { joinArenaDto } from "~/createArena";
const useUser = useUserStore()
const useArena = useArenaStore()
const ip = useRuntimeConfig().public.IP_HOME;

const arenaId = computed(() => useArena.arenaId)
const joinArenaData = reactive<joinArenaDto>({
  arenaId: '',
  name: useUser.user?.username || 'player' + Math.random() * 10 + 1


})


const joinArena = async () => {
  // joinArenaData.arenaId.toLocaleUpperCase() //In Vue 3 Composition API, when you directly mutate a reactive object's property, Vue doesn't automatically detect the change. To trigger reactivity, you need to either assign a new value to the property or use Vue's reactivity API (Vue.set or reactive).
  joinArenaData.arenaId = joinArenaData.arenaId.toLocaleUpperCase(); //this will work
  console.log(joinArenaData) 
  await useArena.joinArena(joinArenaData)

  if (!!useArena.user_arena_token) { //if arena access token STORED go to arena
    console.log(useArena.arenaData)
    navigateTo(`http://${ip}:3000/arena/${arenaId.value}`, { external: true, replace: true })
  }
}
</script>


<template >
  <div @keyup.enter="joinArena" v-motion :initial="{ opacity: 0, x: 1000 }" :visible="{ opacity: 1, x: 0, transition: { duration: 300 } }">
    <div class="grid place-content-center h-screen w-3/6 mx-auto gap-8 ">
      <UFormGroup  label="Arena Id" size="xl" required>
        <UInput v-model="joinArenaData.arenaId" placeholder="" icon="i-heroicons-fire-20-solid" />
      </UFormGroup>
      <UButton   @click="joinArena" size="xl" label="fight" block />
    </div>
  </div>
</template>


<style></style>