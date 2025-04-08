<template>
  <ShortcutText :text="refModel.label" />
</template>

<script setup>
// 声明事件
const emit = defineEmits(["keydown"])
// 声明属性
const props = defineProps({
  keys: {
    type: String,
    default: "",
    validator: (value) => {
      // 这里可以添加你想要的验证逻辑
      return value.length > 0
    },
  },
  label: {
    type: String,
    default: "",
  },
})

const refModel = ref({
  keys: props.keys,
  label: props.label || props.keys,
})

onMounted(() => {
  // 这个函数在production模式下会被优化掉
  const shortcuts = defineShortcuts({
    [refModel.value.keys]: (event) => {
      emit("keydown", event)
    },
  })
  console.log("defined shortcuts", shortcuts)
})
</script>
