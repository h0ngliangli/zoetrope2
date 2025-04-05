<template>
  <div class="flex flex-col h-screen">
    <header
      class="bg-gray-800 text-white p-1 flex flex-row items-center gap-4 pl-4"
    >
      <ULink to="/add">新建</ULink>
      <ULink to="/exec">练习</ULink>
      <UInput
        ref="refInputKw"
        v-model="refKw"
        class="w-32"
        placeholder="关键字或id"
        @keydown.enter="onEdit"
      />
    </header>
    <main class="flex-grow p-4">
      <slot />
    </main>
  </div>
</template>

<script setup>
const refKw = ref("")
const refInputKw = ref(null)
const onEdit = async () => {
  let kw = refKw.value
  refKw.value = ""
  if (!kw) {
    return
  }
  kw = kw.trim()
  const id = Number.parseInt(kw)
  if (Number.isInteger(id)) {
    // 直接跳转到编辑页面
    navigateTo({ path: `/edit/${id}` })
    return
  }
  // 直接跳转到搜索页面
  // const encoded = encodeURIComponent(q)
  // console.log("encoded", encoded)
  await navigateTo({ path: `/search/${kw}` })
}

const _ = defineShortcuts({
  "alt_/": () => {
    console.log("shift_y")
    refInputKw.value.inputRef.focus()
  },
})
console.log("defined shortcuts", _)
</script>
