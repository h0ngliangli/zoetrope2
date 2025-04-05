<template>
  <div>
    <div>
      <MarkdownPreview v-model="refDesc" class="border border-(--ui-border)" />
    </div>
    <UFormField label="一个UInput组件" class="m-4">
      <UInput ref="refElement" />
    </UFormField>
    <div>结果</div>
    <div>
      {{ result }}
    </div>
    <div>结论</div>
    <MarkdownPreview
      v-model="refConclusion"
      class="border border-(--ui-border)"
    />
  </div>
</template>

<script setup>
const refElement = ref(null)
const result = ref([])
const refDesc = ref(`
# 介绍
### 通过ref变量回溯查找element name
比如:
\`\`\`javascript
<UInput ref="refElement" />
\`\`\`
我想知道能否通过ref变量找回"UInput"
`)
const refConclusion = ref(`
### 通过ref得到的是编译后的结果,因此无法再获得编译前的tag name.
`)
onMounted(() => {
  // iterate refElement
  Object.entries(refElement.value).forEach((entry) => {
    const [key, value] = entry
    result.value.push({ key, value })
    console.log(key, value)
  })
})
</script>
