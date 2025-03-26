<template>
  <div>
    <h1>Try to fetch public file</h1>
    <div>$fetch({{ refPath }})</div>
    <div>content:</div>
    <div class="border">{{ content }}</div>
    <div>error:</div>
    <div class="border">{{ error }}</div>
    <div>MDC</div>
    <MDC :value="content" />
  </div>
</template>
<script setup>
const refPath = ref("/sample.md")
const content = ref("")
const error = ref("")
const init = async () => {
  try {
    content.value = await $fetch(refPath.value)
    console.log(content.value)
  } catch (e) {
    console.error(e)
    error.value = e
  }
}
onMounted(() => {
  init()
})
</script>
