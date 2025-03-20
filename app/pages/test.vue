<template>
  <div>
    <UButton label="Show toast" @click="onShowToast" />
  </div>
</template>

<script setup>
const onShowToast = () => {
  const toast = useToast()
  toast.add({
    title: 'Hello world',
    icon: 'i-lucide-info',
    duration: 3000,
    color: 'warning',
    type: 'background',
    close: false,
    ui: {
      progress: "hidden",
    },
  })
}
</script>
