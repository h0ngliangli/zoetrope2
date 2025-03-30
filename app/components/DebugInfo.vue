<!--
显示调试信息
-->
<template>
  <div v-if="utilIsDev()" class="debug-info">
    debug info
    <div ref="thisDebugInfoElement"></div>
  </div>
</template>

<script setup>
import { shikiCodeToHtml } from "~/composables/useShiki"
const thisDebugInfoElement = ref(null)
const model = defineModel()
watch(model, async () => {
  const html = await shikiCodeToHtml(JSON.stringify(model.value), "json")
  thisDebugInfoElement.value.innerHTML = html
})
</script>

<style scoped>
.debug-info {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  margin: 10px 0;
}
</style>
