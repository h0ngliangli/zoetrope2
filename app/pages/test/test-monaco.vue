<template>
  <div class="w-full h-screen border">
    <MonacoTextArea v-model:language="refLanguage" v-model:text="refText" />
    <div>
        <DebugInfo v-model="refText" />
        <DebugInfo v-model="refLanguage" />
    </div>
  </div>
</template>

<script setup>
const refLanguage = ref("javascript")
const refText = ref('console.log("hello world")')
</script>
<!-- TODO 显示支持的所有语言 -->
