<script setup lang="ts">
const refFoo = ref("foo")
const refBar = ref("bar")
const refFoo2 = useState("refFoo2", () => ({ q: "", a: "" }))
watch(refFoo, (newVal, oldVal) => {
  refBar.value = newVal
  refFoo2.value = newVal
})
watch(() => refFoo2.value.q, (newVal, oldVal) => {
  console.log("refFoo2.q changed", newVal)
})
</script>

<template>
  <div>
    <UInput v-model="refFoo2.q" />
    <div>refFoo = {{ refFoo }}</div>
    <div>refBar = {{ refBar }}</div>
    <div>refFoo2 = {{ refFoo2 }}</div>
  </div>
</template>
