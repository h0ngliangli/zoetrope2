<template>
  <div class="flashcard-body">
    <FField v-model="state.q" label="Question" placeholder="What's your question?" />
    <FField
      v-model="state.a"
      label="Answer"
      placeholder="Enter the answer"
      type="textarea"
    />
    <FField
      v-model="state.note"
      label="Note"
      placeholder="Enter the note"
      type="textarea"
    />
    <FField v-model="state.tags" label="Tags" placeholder="tag1 tag2 ..." />
  </div>
</template>

<script setup>
// 为何这里使用reactive，而不是ref？
// 因为model生成的是一个ref对象，如果用v-model="model.q"这样绑定，v-model得到的将不是ref
// 对象，而是字符串对象。
const state = useState("editId")
</script>

<style scoped>
.flashcard-body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
</style>
