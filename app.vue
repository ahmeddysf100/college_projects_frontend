<template>
  <NuxtLoadingIndicator :throttle="0" :height="3" />

  <NuxtLayout>
    <NuxtPage />
    <UNotifications />
  </NuxtLayout>
</template>

<style>
body {

  background-image: url("/public/images/mesh.svg");
  background-size: cover;
  min-height: 100vh;
  line-height: 1.5;

}
</style>