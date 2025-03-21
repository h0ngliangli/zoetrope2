<template>
  <div class="flashcard-body">
    <FField v-model="state.q" label="提问" placeholder="你的问题是什么?" />
    <FField v-model="state.tags" label="标签" placeholder="标签1 标签2 ..." />
    <FField
      v-model="state.a"
      label="答案"
      placeholder="你的答案是什么?"
      type="textarea"
    />
    <FField
      v-model="state.note"
      label="附注"
      placeholder="附注内容"
      type="textarea"
    />
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
