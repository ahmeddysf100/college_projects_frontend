<script lang="ts" setup>
const useArena = useMyCreateArenaStore();
const props = defineProps(['isOpen'])
const isOpen = props.isOpen as boolean
</script>


<template>
  <div>
    <UModal v-model="isOpen" prevent-close>
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              YOUR ARENA URL .
            </h3>
            <UButton color="red" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
              @click="isOpen = false" />
          </div>
        </template>
        
      </UCard>
    </UModal>
  </div>
</template>


<style></style>