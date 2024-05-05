<script lang="ts" setup>
import type { OfflinePlayers, part } from '~/createArena';

const props = defineProps(['offlinePlayer'])
const emit = defineEmits(['remove_participant'])
const offlinePlayer = ref<OfflinePlayers>(props.offlinePlayer)
const color = ref()

const remove_participant = () => {
  emit('remove_participant', {
    id: offlinePlayer.value.id,
    name: offlinePlayer.value.name
  })
}

const items= [
  [{
    label: 'REMOVE PLAYER',
    slot: 'delete'
  }]]



onMounted(() => {
})
</script>


<template>
  <div class="m-14">
    <UDropdown mode="hover" :items="items" :popper="{ offsetDistance: 0,placement: 'bottom' }">
  <div 
    class=" bg-green-500 hover:bg-rose-500 cursor-pointer text-center   p-4 rounded-xl hover:translate-y-1 transition-all duration-200 ease-in-out">
    <p class=" text-lg font-bold">{{ offlinePlayer.name }}</p>
  </div>
  <template #delete="{item}">
    <UButton @click="remove_participant" color="red"  :label="item.label" block/>
  </template>
</UDropdown>
</div>




</template>


<style scoped>
.smooth {
  transition-property: all;
  transition-duration: 1000ms;
  transition-timing-function: linear;
}
</style>