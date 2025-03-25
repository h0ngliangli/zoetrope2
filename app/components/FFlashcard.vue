<template>
  <div class="flashcard-body">
    <FField
      v-model="state.q"
      :type="mode2type[`${mode}_q`]"
      label="提问"
      placeholder="你的问题是什么?"
      focuskey="q"
    />
    <FField
      v-model="state.tags"
      :type="mode2type[`${mode}_tags`]"
      label="标签"
      placeholder="标签1 标签2 ..."
      focuskey="t"
    />
    <FField
      v-model="state.a"
      :type="mode2type[`${mode}_a`]"
      label="答案"
      placeholder="你的答案是什么?"
      focuskey="a"
    />
    <FField
      v-model="state.note"
      :type="mode2type[`${mode}_note`]"
      label="附注"
      placeholder="附注内容"
      focuskey="n"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  state: {
    type: String,
    required: true,
  },
  mode: {
    type: String,
    default: "edit",
    validator: (value) => ["edit", "exec", "view"].includes(value),
  },
})
const mode2type = {
  edit_q: "input",
  edit_tags: "input",
  edit_a: "textarea",
  edit_note: "textarea",
  exec_q: "readonly",
  exec_tags: "readonly",
  exec_a: "input",
  exec_note: "readonly",
  view_q: "readonly",
  view_tags: "readonly",
  view_a: "readonly",
  view_note: "readonly",
}
// 为何这里使用reactive，而不是ref？
// 因为model生成的是一个ref对象，如果用v-model="model.q"这样绑定，v-model得到的将不是ref
// 对象，而是字符串对象。
const state = useState(props.state)
</script>

<style scoped>
.flashcard-body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}
</style>
