<template>
  <div>
    <FFlashcard2 />
    <div class="mt-4 ml-4">
      <UButton
        :loading="refLoadingState"
        label="保存"
        color="secondary"
        @click="onSave"
      />
    </div>

    <!-- Debug Info -->
    <USeparator class="h-8" />
    <div>
      <UCard>
        <template #header>
          <h1>Debug Info</h1>
        </template>
        <div>
          <div>$route.fullPath = {{ $route.fullPath }}</div>
          <div>$route.params.id = {{ $route.params.id }}</div>
          <div>editId = {{ state }}</div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const state = useState("editId", () => ({
  id: route.params.id,
  q: "",
  a: "",
  tags: "",
  note: "",
}))
const refLoadingState = ref(false)

// const model = ref({ id: route.params.id, q: "123", a: "", tags: "", note: "" })
// vue中直接调用async函数会导致ref无法显示，解决方法是将其放在setup函数中，然后在mounted钩子中调用
const setup = async () => {
  if (state.value.id !== "new") {
    const response = await $fetch(`/api/get/${state.value.id}`)
    if (response.ok) {
      console.log(response.data)
      // 这里可以直接将response.data赋值给state.value，
      // 但为谨慎起见逐个赋值
      // state.value = response.data
      state.value.q = response.data.q
      state.value.a = response.data.a
      state.value.tags = response.data.tags
      state.value.note = response.data.note
    } else {
      showErrorToast(`没有找到id为${state.value.id}的卡片，你可以创建一个新的`)
      state.value.id = "new"
    }
  }
}

const onSave = async () => {
  refLoadingState.value = true
  const response = await $fetch("/api/save", {
    method: "POST",
    body: { ...state.value },
  })
  if (response.ok) {
    state.value.id = response.data.id
    showSuccessToast(`卡片 ${state.value.id} 保存成功`)
  } else {
    showErrorToast(response.message)
  }
  // 延期1秒关闭loading状态, 以便用户看到保存成功的提示
  setTimeout(() => {
    refLoadingState.value = false
  }, 1000)
}

// watch(state, (newState, oldState) => {
//   // 修改state.value.q不会触发这个watch
//   console.log("state changed", newState)
// })

// 通过函数watch来监听state.value.id的变化
watch(() => state.value.id, (newId, oldId) => {
  console.log("id changed", oldId, newId)
  router.replace(`/edit-${newId}`)
})

onMounted(setup)
</script>
