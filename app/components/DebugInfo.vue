<!--
显示调试信息
-->
<template>
  <div v-if="utilIsDev()" class="debug-info">
    debug info
    <div ref="containerDebugInfo" />
  </div>
</template>

<script setup>
import { useShiki_CodeToHtml } from "~/composables/useShiki"

// vars
const containerDebugInfo = ref(null)
// eslint-disable-next-line vue/require-prop-types
const model = defineModel()

// methods
// 当model变化时，调用此函数更新调试信息
const updateDebugInfoHtml = async () => {
  if (containerDebugInfo.value) {
    const html = await useShiki_CodeToHtml(
      JSON.stringify(model.value, null, 2),
      "json"
    )
    containerDebugInfo.value.innerHTML = html
  }
}

watchEffect(async () => {
  console.log("watchEffect", model.value)
  await updateDebugInfoHtml()
})

// 这种方式不会触发. 使用watchEffect
// watch(model, async () => {
//   console.log("watch model", model.value)
//   await updateDebugInfo()
// })

onMounted(async () => {
  await updateDebugInfoHtml()
})
</script>

<style scoped>
.debug-info {
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
}
</style>
