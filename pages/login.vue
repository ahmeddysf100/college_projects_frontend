<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import { z } from "zod";
import type { login, Signup } from "~/types";

definePageMeta({
  middleware: ["already-auth"],
  layout: "default",
});

const items = [
  {
    slot: "login",
    label: "Login",
  },
  {
    slot: "signup",
    label: "Signup",
  },
];

const formstate = ref({
  email: "",
  password: "",
});

const signUpFrom = reactive({
  namee: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "user",
});
// const confirmPassword = ref()

const schemaLogin = z.object({
  email: z.string().refine(
    (value) => {
      // Customize the regular expression to allow the characters you want
      const regex = /^[a-zA-Z0-9&._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return regex.test(value);
    },
    {
      message: "Invalid email address",
    }
  ),
  password: z.string().min(4, "Most at least 4 characters"),
});
type SchemaLogin = z.output<typeof schemaLogin>;

const useStore = useUserStore();
async function handleFormSubmit(event: FormSubmitEvent<SchemaLogin>) {
  console.log(event.data.email);
  const data = JSON.stringify({
    email: event.data.email,
    password: event.data.password,
  });
  // Parse the JSON string to an object of type Login
  const loginData: login = JSON.parse(data);

  await useStore.login(loginData);

  if (useStore.user?.role === "admin") {
    await navigateTo("/dashboard", { replace: true });
  }

  if (useStore.user?.role === "user") {
    await navigateTo("/", { replace: true });
  }
  // await navigateTo("/dashboard", { replace: true })
}

const schemaSignup = z
  .object({
    namee: z.string().min(5, "Most at least 5 characters"),
    email: z.string().refine(
      (value) => {
        // Customize the regular expression to allow the characters you want
        const regex = /^[a-zA-Z0-9&._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(value);
      },
      {
        message: "Invalid email address",
      }
    ),
    password: z.string().min(5, "Most at least 4 characters"),
    confirmPassword: z.string().min(5, "Most at least 4 characters"),
  })
  .refine((value) => value.confirmPassword === value.password, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
type SchemaSignup = z.output<typeof schemaSignup>;
async function handleFormSubmit_signup(event: FormSubmitEvent<SchemaSignup>) {
  console.log(event.data.email);
  const data = JSON.stringify({
    namee: event.data.namee,
    email: event.data.email,
    password: event.data.password,
    role: signUpFrom.role,
  });
  // Parse the JSON string to an object of type Login
  const loginData: Signup = JSON.parse(data);

  await useStore.signup(loginData);

  // if (useStore.user?.role === "admin") {
  //   await navigateTo("/dashboard", { replace: true });
  // }

  // if (useStore.user?.role === "user") {
  //   await navigateTo("/", { replace: true });
  // }
  // await navigateTo("/dashboard", { replace: true })
}

const tabIndex = ref(0);

const toSignup = () => {
  tabIndex.value = 1;
  // console.log(tabIndex.value)
};
const toLogin = () => {
  tabIndex.value = 0;
  // console.log(tabIndex.value)
};
</script>

<template>
  <ModalError />
  <div class="">
    <UContainer class="grid place-content-center h-screen justify-stretch">
      <!-- <UCard v-if="useStore.apiErrors" class=" ">
      <template #header>
        <h2 class=" text-xl font-bold text-center">Error In Login</h2>
      </template>
      <p class=" text-center text-red-600 font-semibold">{{ useStore.apiErrors }}</p>
      <UButton @click="useStore.logout" label="Try another credentials" class=" mt-4 text-base" block />
      </UCard> -->

      <UTabs v-model="tabIndex" :items="items" class="w-full">
        <template #login="{ item }">
          <UCard>
            <template #header>
              <h2 class="text-xl font-bold text-center">Login Form</h2>
            </template>

            <UForm :schema="schemaLogin" :state="formstate" @submit="handleFormSubmit">
              <UFormGroup label="Email" name="email">
                <UInput type="email" v-model="formstate.email" placeholder="jabarmangole@gmail.com"></UInput>
              </UFormGroup>

              <UFormGroup label="Password" class="mt-4" name="password">
                <UInput type="password" v-model="formstate.password" placeholder="3abee meno wa fee"></UInput>
              </UFormGroup>

              <UButton type="submit" class="mt-4 text-base" block>Login</UButton>
            </UForm>
            <UButton class="pt-3" @click="toSignup" label="Create Account ?" color="emerald" variant="link" />
          </UCard>
        </template>

        <template #signup="{ item }">
          <UCard>
            <template #header>
              <h2 class="text-xl font-bold text-center">Signup Form</h2>
            </template>

            <UForm :schema="schemaSignup" :state="signUpFrom" @submit="handleFormSubmit_signup">
              <UFormGroup label="Name" name="namee">
                <UInput type="text" v-model="signUpFrom.namee" placeholder="jabar"></UInput>
              </UFormGroup>

              <UFormGroup label="Email" class="mt-4" name="email">
                <UInput type="email" v-model="signUpFrom.email" placeholder="jabarmangole@gmail.com"></UInput>
              </UFormGroup>

              <UFormGroup label="Password" class="mt-4" name="password">
                <UInput type="password" v-model="signUpFrom.password" placeholder="3abee meno wa fee"></UInput>
              </UFormGroup>

              <UFormGroup label="Confirm Password" class="mt-4" name="confirmPassword">
                <UInput type="password" v-model="signUpFrom.confirmPassword" placeholder="3abee meno wa fee"></UInput>
              </UFormGroup>

              <p class=" text-center text-red-600 font-semibold">{{ useStore.apiErrors }}</p>
              <UButton type="submit" class="mt-4 text-base" block>Login</UButton>
            </UForm>
            <UButton class="pt-3" @click="toLogin" label="I Have Account !" color="emerald" variant="link" />
          </UCard>
        </template>
      </UTabs>
    </UContainer>
  </div>
</template>

<style></style>
