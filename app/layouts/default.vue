<template>
  <div class="flex flex-col h-screen">
    <header class="bg-gray-800 text-white p-1 flex gap-4 pl-4">
      <!-- <h1 class="text-2xl"></h1> -->
      <ULink to="/add" as="button">新建</ULink>
      <ULink to="/exec">练习</ULink>
      <ULink to="/search">查找</ULink>
      <span>前往</span>
      <UInput v-model="refGoto" @keydown.enter="onEdit" />
    </header>
    <main class="flex-grow p-4">
      <slot />
    </main>
    <!-- <footer class="bg-gray-800 text-white p-4">
      <p>&copy; 2023 My App</p>
    </footer> -->
  </div>
</template>

<script setup>
const refGoto = ref('')
const onEdit = () => {
  if (refGoto.value) {
    const id = refGoto.value
    refGoto.value = ''
    navigateTo({ path: `/edit-${id}` })
  }
}
</script>
