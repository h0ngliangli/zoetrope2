<template>
  <div>
    <FFlashcard v-model="model" />
    <div class="mt-4 ml-4">
      <UButton label="Save" @click="onSave" /> 
      
    </div>
    <div>Flashcard data: {{ model }}</div>
  </div>
</template>

<script setup>
// eslint-disable-next-line vue/require-prop-types
const model = defineModel({
  default: { q: "", a: "", tags: "", note: "" },
})

const onSave = async () => {
  const { id } = await $fetch("/api/save", {
    method: "POST",
    body: model.value,
  })
  const toast = useToast()
  toast.add({
    title: `Flashcard ${id} saved successfully`,
  })
}
</script>
