<template>
  <div>
    <MarkdownPreview v-model="refDesc" />
    <!-- 测试 -->
    <ShortcutHere keys="/"  @keydown="hoola" />
    <ShortcutHere keys="\" label="按\" @keydown="hoola" />
    <ShortcutHere keys="shift_f"  @keydown="hoola" />
  </div>
</template>
<script setup>
const refDesc = ref(`
# 测试<ShortcutAction>组件
`)
const hoola = (event) => {
  console.log(event)
  // 这里可以添加你想要执行的操作
  // 比如调用一个函数或者改变某个状态
  alert("hoola")
}
</script>
