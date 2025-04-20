<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <h1 class="text-2xl font-bold">
      {{ error.statusCode }}
      {{ error.statusMessage }}
    </h1>
    <p>
      <ULink to="/">返回首页</ULink>
    </p>
  </div>
</template>

<script setup>
const error = useError()
</script>
