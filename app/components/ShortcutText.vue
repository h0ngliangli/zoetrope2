<template>
  <span class="shortcut-text">{{ $props.text }}</span>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: "",
  },
})
</script>
