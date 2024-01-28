<script lang="ts" setup>
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types';
import { z } from 'zod';
import type { login } from '~/types';

definePageMeta({
  middleware: ['already-auth'],
  layout: 'default',
})

const formstate = ref({
  email: '',
  password: '',
})

const schema = z.object({
  email: z.string().refine((value) => {
    // Customize the regular expression to allow the characters you want
    const regex = /^[a-zA-Z0-9&._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(value);
  }, {
    message: 'Invalid email address',
  }),
  password: z.string().min(4, 'Most at least 4 characters')
})
type Schema = z.output<typeof schema>

const useStore = useUserStore()
async function handleFormSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data.email)
  const data = JSON.stringify({
    email: event.data.email,
    password: event.data.password,
  })
  // Parse the JSON string to an object of type Login
  const loginData: login = JSON.parse(data);

  await useStore.login(loginData)
  await navigateTo("/dashboard", { replace: true })
}

</script>
<template>
  <div class="">
  <UContainer class="grid place-content-center h-screen justify-stretch">
    <UCard v-if="useStore.apiErrors" class=" ">
      <template #header>
        <h2 class=" text-xl font-bold text-center">Error In Login</h2>
      </template>
      <p class=" text-center text-red-600 font-semibold">{{ useStore.apiErrors }}</p>
      <UButton @click="useStore.logout" label="Try another credentials" class=" mt-4 text-base" block />
    </UCard>

    <UCard v-else class="">

      <template #header>
        <h2 class=" text-xl font-bold text-center">Login To Admin Page</h2>
      </template>

      <UForm :schema="schema" :state="formstate" @submit="handleFormSubmit">

        <UFormGroup label="Email" name="email">
          <UInput type="email" v-model="formstate.email" placeholder="jabarmangole@gmail.com"></UInput>
        </UFormGroup>

        <UFormGroup label="Password" class=" mt-4" name="password">
          <UInput type="password" v-model="formstate.password" placeholder="3abee meno wa fee"></UInput>
        </UFormGroup>
        <UButton type="submit" class=" mt-4 text-base" block>Login</UButton>

      </UForm>

    </UCard>
  </UContainer>
</div>
</template>



<style></style>