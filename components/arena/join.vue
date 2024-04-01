<script lang="ts" setup>
import type { joinArenaDto } from "~/createArena";
const useUser = useUserStore()
const useArena = useArenaStore()

const arenaId = computed(() => useArena.user_arena_id)
const joinArenaData = reactive<joinArenaDto>({
  arenaId: '',
  name: useUser.user?.username || 'player' + Math.random() * 10 + 1


})


const joinArena = async () => {
  console.log(joinArenaData.name)
  await useArena.joinArena(joinArenaData)

  if (useArena.user_arena_token) {
    console.log(useArena.arenaData)
    navigateTo(`http://192.168.31.170:3000/arena/${arenaId.value}`, { external: true, replace: true })
  }
}
</script>


<template>
  <div v-motion :initial="{ opacity: 0, x: 1000 }" :visible="{ opacity: 1, x: 0, transition: { duration: 300 } }">
    <div class="grid place-content-center h-screen w-3/6 mx-auto gap-8 ">
      <UFormGroup label="Arena Id" size="xl" required>
        <UInput v-model="joinArenaData.arenaId" placeholder="" icon="i-heroicons-fire-20-solid" />
      </UFormGroup>
      <UButton @click="joinArena" size="xl" label="fight" block />
    </div>
  </div>
</template>


<style></style>