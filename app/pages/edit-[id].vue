<template>
  <div>
    <FlashcardEdit v-model="model" />
    <USeparator class="h-8" />
    <div>
      <UCard>
        <template #header>
          <h1>Debug Info</h1>
        </template>
        <div>
          <div>$route.fullPath = {{ $route.fullPath }}</div>
          <div>$route.params.id = {{ $route.params.id }}</div>
          <div>model = {{ model }}</div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const model = ref({
  q: "",
  a: "",
  tags: "",
})
onMounted(async () => {
  const response = await $fetch(`/api/get/${route.params.id}`)
  console.log(response)
  model.value = response
})
</script>
