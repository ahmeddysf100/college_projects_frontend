<script lang="ts" setup>
import type { part, participant, Ranks } from '~/createArena';

const useArena = useArenaStore();
const props = defineProps(['img', 'name', 'max', 'participants'])
const img = props.img + 1 as number
const max = props.max as number
const participants = props.participants as boolean
// console.log(participants)
const player = computed(() => props.name as Ranks);
console.log('ana', player.value)
const temp = 40 
</script>


<template>
  <div class="py-4 ">
    <UProgress :value="player.questions" :max="max" color="primary" size="lg">
      <template #indicator="{ percent }">
        <div class="text-right" :style="{ width: `${percent}%` }">

          <!-- <div class=" grid place-content-center"> -->
          <UChip :color="participants === true ? 'primary' : 'red'" :text="participants === true ? 'online' : 'offline'"
            size="2xl" inset>

            <UAvatar :src="`https://i.pravatar.cc/1000?img=${img}`" size="xl" />
          </UChip>
          <p><span :class="img === 1 ? 'text-yellow-300' : ''">{{ img }}st/{{ player.name }}</span><span
              class="text-green-500 font-bold">/score:{{ player.score }}/</span><span class="text-red-500 font-bold">{{
              percent }}%</span></p>
          <!-- <UAvatar src="https://api.dicebear.com/8.x/lorelei-neutral/svg?seed=Felix&scale=150" alt="Avatar" size="3xl" /> -->
          <!-- </div> -->


        </div>
      </template>
    </UProgress>
  </div>
</template>


<style></style>