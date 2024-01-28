<script setup>
const columns = [{
  key: 'name',
  label: 'Name'
}, {
  key: 'actions',
  label: 'Actions'
}, {
  key: 'email',
  label: 'Email'
}, {
  key: 'role',
  label: 'Role'
}, {
  key: 'title',
  label: 'Title'
}]





const people = [{
  id: 1,
  name: 'Lindsay Walton',
  title: 'Front-end Developer',
  email: 'lindsay.walton@example.com',
  role: 'Member'
}, {
  id: 2,
  name: 'Courtney Henry',
  title: 'Designer',
  email: 'courtney.henry@example.com',
  role: 'Admin'
}, {
  id: 3,
  name: 'Tom Cook',
  title: 'Director of Product',
  email: 'tom.cook@example.com',
  role: 'Member'
}, {
  id: 4,
  name: 'Whitney Francis',
  title: 'Copywriter',
  email: 'whitney.francis@example.com',
  role: 'Admin'
}, {
  id: 5,
  name: 'Leonard Krasner',
  title: 'Senior Designer',
  email: 'leonard.krasner@example.com',
  role: 'Owner'
}, {
  id: 6,
  name: 'Floyd Miles',
  title: 'Principal Designer',
  email: 'floyd.miles@example.com',
  role: 'Member'
}]

const items = (row) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => console.log('Edit', row.id)
  }, {
    label: 'Duplicate',
    icon: 'i-heroicons-document-duplicate-20-solid'
  }], [{
    label: 'Archive',
    icon: 'i-heroicons-archive-box-20-solid'
  }, {
    label: 'Move',
    icon: 'i-heroicons-arrow-right-circle-20-solid'
  }], [{
    label: 'Delete',
    icon: 'i-heroicons-trash-20-solid'
  }]
]

const selected = ref([people[1]])




const isOpen = ref(false)

</script>

<template>
  <!-- <UTable v-model="selected" :rows="people" :columns="columns">
    <template #name-data="{ row }">
      <span :class="[selected.find(person => person.id === row.id) && 'text-primary-500 dark:text-primary-400']">{{
        row.name }}</span>
    </template>

    <template #actions-data="{ row }">
      <UDropdown :items="items(row)">
        <UButton color="gray" variant="ghost">
          <svg class="w-5 h-5 fill-slate-900 dark:fill-slate-100" id="Layer_1" data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <g id="SVGRepo_iconCarrier">
              <path class="cls-1"
                d="M8,6.5A1.5,1.5,0,1,1,6.5,8,1.5,1.5,0,0,1,8,6.5ZM.5,8A1.5,1.5,0,1,0,2,6.5,1.5,1.5,0,0,0,.5,8Zm12,0A1.5,1.5,0,1,0,14,6.5,1.5,1.5,0,0,0,12.5,8Z">
              </path>
            </g>
          </svg>
        </UButton>
      </UDropdown>
    </template>
  </UTable> -->
  <!-- <UContainer v-if="isOpen">
    <Placeholder class="h-32" />
    aaaaaaaaaaaaaaaaaaa
  </UContainer>
  <UButton label="click" @click="isOpen = !isOpen" class="mx-auto flex"/>
   -->

   <zzz/>
</template>

