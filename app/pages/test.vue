<template>
  <div>
    <USelectMenu
      v-model="select"
      :items="toasts.map((toast) => toast.color)"
      class="w-48"
    />
    <UButton label="Show toast" @click="onShowToast" />
    <UButton label="showError() from nuxt" @click="showError('😱 Oh no, an error has been thrown.')"/>
  </div>
</template>

<script setup>
const toasts = [
  { text: "this is a toast", color: "info" },
  { text: "this is a toast", color: "success" },
  { text: "this is a toast", color: "warning" },
  { text: "this is a toast", color: "error" },
]
const select = ref("")

const onShowToast = () => {
  // const toast = useToast()
  // toast.add({
  //   title: 'Hello world',
  //   icon: 'i-material-symbols-info',
  //   duration: 3000,
  //   color: 'info',
  //   ui: {
  //     progress: "hidden",
  //   },
  // })
  if (select.value === "") {
    return
  }
  const text = toasts.find((toast) => toast.color === select.value).text
  if (select.value === "info") {
    showInfoToast(text)
  }
  if (select.value === "success") {
    showSuccessToast(text)
  }
  if (select.value === "warning") {
    showWarningToast(text)
  }
  if (select.value === "error") {
    showErrorToast(text)
  }
}
</script>
