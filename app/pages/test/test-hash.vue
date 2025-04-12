<template>
  <pre
    >{{ refMainString }}
  f</pre>
</template>

<script setup>
const route = useRoute()
const refMain = ref({
  fullPath: route.fullPath,
  hash: route.hash,
  query: route.query,
  matched: route.matched,
  meta: route.meta,
  name: route.name,
  path: route.path,
  redirectedFrom: route.redirectedFrom,
})
const refMainString = computed(() => {
  return JSON.stringify(refMain.value, null, 2)
})
</script>
