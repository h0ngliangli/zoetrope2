<template>
  <div>
    <div class="mdc">
      <h1>test</h1>
    </div>
    <div class="m-4 mdc">
      <h1>test</h1>
      <MDC :value="md" class="mdc"/>
    </div>
  </div>
</template>

<script setup>
const md = ref(`
# Welcome to docs4.dev

Paragraphs can contain inline code \`const codeInline: string = 'highlighted code inline'\`{lang="ts"} with language prop.

Code block:
\`\`\` typescript
import {parseMarkdown} from '@nuxtjs/mdc/runtime'

async function main(mdc: string) {
  const ast = await parseMarkdown(mdc)

  return ast
}
\`\`\`
`)

// read file content
const init = async () => {
  try {
    md.value = await $fetch("/sample.md")
    console.log(md.value)
  } catch (e) {
    console.error(e)
  }
  // md.value = await $fetch('/sample.md')
}

onMounted(() => {
  init()
})
</script>

<style scoped>
.mdc p {
  line-height: 10rem;
}
.mdc h1 {
  color: red;
}
</style>
