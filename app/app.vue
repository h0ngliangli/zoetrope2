<template>
  <UApp :toaster="appConfig.toaster">
    <NuxtPage />
  </UApp>
</template>

<script setup>
const appConfig = useAppConfig()
</script>