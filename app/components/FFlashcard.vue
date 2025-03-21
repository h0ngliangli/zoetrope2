<template>
  <div class="flashcard-body">
    <FField v-model="realModel.q" label="Question" placeholder="What's your question?" />
    <FField
      v-model="realModel.a"
      label="Answer"
      placeholder="Enter the answer"
      type="textarea"
    />
    <FField
      v-model="realModel.note"
      label="Note"
      placeholder="Enter the note"
      type="textarea"
    />
    <FField v-model="realModel.tags" label="Tags" placeholder="tag1 tag2 ..." />
  </div>
</template>

<script setup>
// 为何这里使用reactive，而不是ref？
// 因为model生成的是一个ref对象，如果用v-model="model.q"这样绑定，v-model得到的将不是ref
// 对象，而是字符串对象。
const realModel = reactive({ q: "", a: "", note: "", tags: "" })
// eslint-disable-next-line vue/require-prop-types
const model = defineModel({
  default: { q: "", a: "", note: "", tags: "" },
})
onMounted(() => {
  realModel.q = model.value.q
  realModel.a = model.value.a
  realModel.note = model.value.note
  realModel.tags = model.value.tags
})
watchEffect(() => {
  model.value.q = realModel.q
  model.value.a = realModel.a
  model.value.note = realModel.note
  model.value.tags = realModel.tags
})
</script>

<style scoped>
.flashcard-body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
</style>
