<template>
  <ShortcutText
    v-for="(tag, index) in text.split(' ')"
    :key="index"
    :text="tag"
  />
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: "",
  },
})
</script>
