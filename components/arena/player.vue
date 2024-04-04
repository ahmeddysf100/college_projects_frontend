<script lang="ts" setup>
import type { part, participant } from '~/createArena';

const useArena = useArenaStore();
const props = defineProps(['img', 'name', 'max'])
const img = props.img as number
const max = props.max as number
// const name = props.name as part
const name = Object.values(props.name) as any;
console.log(name)
const temp = 40 
</script>


<template>
  <div class="pt-3 border">
    <UProgress :value="name[1].rank" :max="max" color="primary" size="lg">
      <template #indicator="{ percent }">
        <div class="text-right" :style="{ width: `${percent}%` }">

          <!-- <div class=" grid place-content-center"> -->
          <UChip :color="name[1].isOnline === true ? 'primary' : 'red'"
            :text="name[1].isOnline === true ? 'online' : 'offline'" size="2xl" inset>
            <UAvatar :src="`https://i.pravatar.cc/1000?img=${img}`" size="xl" />
          </UChip>
          <p>{{ name[1].name }}/<span class="text-red-500 font-bold">{{ percent }}%</span></p>
          <!-- <UAvatar src="https://api.dicebear.com/8.x/lorelei-neutral/svg?seed=Felix&scale=150" alt="Avatar" size="3xl" /> -->
          <!-- </div> -->


        </div>
      </template>
    </UProgress>
  </div>
</template>


<style></style>