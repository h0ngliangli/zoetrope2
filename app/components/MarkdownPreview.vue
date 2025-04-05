<template>
  <div ref="refMain" class="markdown" />
</template>

<script setup>
// eslint-disable-next-line vue/require-prop-types
const model = defineModel({
  default: "",
})
const refMain = ref(null)
onMounted(() => {
  watchEffect(async () => {
    refMain.value.innerHTML = useMarkdownIt_render2Html(model.value)
  })
})
</script>
